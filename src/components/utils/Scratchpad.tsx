import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js"

type NoteState = {
  id: string
  title: string
  body: string
  slug: string
  shareToken: string
  updatedAt: string
}

const DRAFT_KEY = "utils:scratchpad:draft:v1"

function randomId() {
  return (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`)
}

function randomToken() {
  return Math.random().toString(36).slice(2, 12)
}

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
  return base || "untitled-note"
}

function createBlankNote(): NoteState {
  return {
    id: randomId(),
    title: "Untitled note",
    body: "",
    slug: "untitled-note",
    shareToken: randomToken(),
    updatedAt: new Date().toISOString(),
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function safeHref(rawHref: string) {
  const href = rawHref.trim()
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(href)) return href
  return "#"
}

function formatInline(value: string) {
  let out = escapeHtml(value)
  out = out.replace(/`([^`]+?)`/g, "<code>$1</code>")
  out = out.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
  out = out.replace(/\*([^*]+?)\*/g, "<em>$1</em>")
  out = out.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, (_, text: string, href: string) => {
    const safe = escapeHtml(safeHref(href))
    return `<a href="${safe}" rel="noopener noreferrer nofollow" target="_blank">${text}</a>`
  })
  return out
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const html: string[] = []
  let inCode = false
  let inUl = false
  let inOl = false

  function closeLists() {
    if (inUl) {
      html.push("</ul>")
      inUl = false
    }
    if (inOl) {
      html.push("</ol>")
      inOl = false
    }
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      closeLists()
      if (!inCode) {
        html.push("<pre><code>")
        inCode = true
      } else {
        html.push("</code></pre>")
        inCode = false
      }
      continue
    }

    if (inCode) {
      html.push(`${escapeHtml(line)}\n`)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      closeLists()
      const level = heading[1].length
      html.push(`<h${level}>${formatInline(heading[2])}</h${level}>`)
      continue
    }

    const ul = line.match(/^[-*+]\s+(.+)$/)
    if (ul) {
      if (!inUl) {
        if (inOl) {
          html.push("</ol>")
          inOl = false
        }
        html.push("<ul>")
        inUl = true
      }
      html.push(`<li>${formatInline(ul[1])}</li>`)
      continue
    }

    const ol = line.match(/^\d+\.\s+(.+)$/)
    if (ol) {
      if (!inOl) {
        if (inUl) {
          html.push("</ul>")
          inUl = false
        }
        html.push("<ol>")
        inOl = true
      }
      html.push(`<li>${formatInline(ol[1])}</li>`)
      continue
    }

    if (line.trim() === "---") {
      closeLists()
      html.push("<hr />")
      continue
    }

    const quote = line.match(/^>\s+(.+)$/)
    if (quote) {
      closeLists()
      html.push(`<blockquote>${formatInline(quote[1])}</blockquote>`)
      continue
    }

    if (line.trim().length === 0) {
      closeLists()
      html.push("")
      continue
    }

    closeLists()
    html.push(`<p>${formatInline(line)}</p>`)
  }

  if (inCode) html.push("</code></pre>")
  closeLists()

  return html.join("\n")
}

export default function Scratchpad() {
  const [note, setNote] = createSignal<NoteState>(createBlankNote())
  const [previewVisible, setPreviewVisible] = createSignal(true)
  const [statusText, setStatusText] = createSignal("Ready")
  let fileInputRef: HTMLInputElement | undefined
  let autosaveTimer: number | undefined

  function updateNote(patch: Partial<NoteState>) {
    setNote((current) => {
      const next = { ...current, ...patch, updatedAt: new Date().toISOString() }
      if (patch.title !== undefined && patch.title !== current.title) {
        next.slug = slugify(patch.title)
      }
      return next
    })
  }

  function writeDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(note()))
      setStatusText(`Saved at ${new Date().toLocaleTimeString()}`)
    } catch {
      setStatusText("Local save failed")
    }
  }

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = { "content-type": "application/json" }
    const identityUser = (window as Window & { netlifyIdentity?: { currentUser?: () => { jwt?: () => Promise<string> } | null } }).netlifyIdentity?.currentUser?.()
    if (!identityUser?.jwt) return headers
    try {
      const token = await identityUser.jwt()
      if (token) headers.Authorization = `Bearer ${token}`
    } catch { /* no session in local dev */ }
    return headers
  }

  async function syncRemote() {
    try {
      const state = note()
      const res = await fetch("/api/notes-upsert", {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          id: state.id,
          slug: state.slug,
          shareToken: state.shareToken,
          title: state.title,
          body: state.body,
        }),
      })
      if (!res.ok) return
      const saved = await res.json()
      setNote((c) =>
        saved.id === c.id && saved.slug === c.slug && saved.shareToken === c.shareToken
          ? c
          : { ...c, id: saved.id || c.id, slug: saved.slug || c.slug, shareToken: saved.shareToken || c.shareToken }
      )
    } catch { /* silent — local draft is the source of truth */ }
  }

  function queueAutosave() {
    if (autosaveTimer) window.clearTimeout(autosaveTimer)
    autosaveTimer = window.setTimeout(() => {
      writeDraft()
      void syncRemote()
    }, 3000)
  }

  function startNewNote() {
    setNote(createBlankNote())
    setStatusText("Created new note")
    queueAutosave()
  }

  function triggerImport() {
    fileInputRef?.click()
  }

  function onImportFile(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const body = String(reader.result || "")
      const baseName = file.name.replace(/\.md$/i, "").trim()
      updateNote({
        body,
        title: baseName ? baseName : note().title,
      })
      setStatusText(`Imported ${file.name}`)
      queueAutosave()
    }
    reader.readAsText(file)
    input.value = ""
  }

  function exportMarkdown() {
    const state = note()
    const frontmatter = `---\ntitle: ${state.title}\n---\n\n`
    const content = `${frontmatter}${state.body}`
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const href = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = href
    link.download = `${state.slug}.md`
    link.click()
    URL.revokeObjectURL(href)
    setStatusText("Exported markdown file")
  }

  createEffect(() => {
    note()
    queueAutosave()
  })

  onMount(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY)
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as NoteState
        setNote({ ...createBlankNote(), ...parsed })
        setStatusText("Restored local draft")
      }
    } catch {
      setStatusText("Failed to restore local data")
    }

    const onBlur = () => { writeDraft(); void syncRemote() }
    window.addEventListener("blur", onBlur)
    onCleanup(() => {
      window.removeEventListener("blur", onBlur)
      if (autosaveTimer) window.clearTimeout(autosaveTimer)
    })
  })

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button type="button" onClick={startNewNote} class="px-3 py-1 rounded-full text-sm border border-black/15 dark:border-white/25 hover:bg-black/5 hover:dark:bg-white/10 transition-colors duration-300 ease-in-out">New note</button>
        <button type="button" onClick={triggerImport} class="px-3 py-1 rounded-full text-sm border border-black/15 dark:border-white/25 hover:bg-black/5 hover:dark:bg-white/10 transition-colors duration-300 ease-in-out">Import .md</button>
        <button type="button" onClick={exportMarkdown} class="px-3 py-1 rounded-full text-sm border border-black/15 dark:border-white/25 hover:bg-black/5 hover:dark:bg-white/10 transition-colors duration-300 ease-in-out">Export .md</button>
        <button type="button" onClick={() => setPreviewVisible(!previewVisible())} class="px-3 py-1 rounded-full text-sm border border-black/15 dark:border-white/25 hover:bg-black/5 hover:dark:bg-white/10 transition-colors duration-300 ease-in-out">{previewVisible() ? "Hide preview" : "Show preview"}</button>
        <input ref={fileInputRef} type="file" accept=".md,text/markdown" class="hidden" onChange={onImportFile} />
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <section class="border rounded-lg border-black/15 dark:border-white/20 p-4">
          <div class="text-sm uppercase text-black/60 dark:text-white/60 mb-3">
            Editor
          </div>
          <div class="space-y-3">
            <input
              type="text"
              value={note().title}
              onInput={(event) => updateNote({ title: event.currentTarget.value })}
              class="w-full rounded-md border border-black/15 dark:border-white/25 bg-transparent px-3 py-2 text-sm"
              placeholder="Title"
            />
            <textarea
              value={note().body}
              onInput={(event) => updateNote({ body: event.currentTarget.value })}
              class="min-h-[420px] w-full rounded-md border border-black/15 dark:border-white/25 bg-transparent p-3 text-sm leading-6"
              placeholder="Write markdown here..."
            />
          </div>
        </section>

        <Show when={previewVisible()}>
          <section class="border rounded-lg border-black/15 dark:border-white/20 p-4">
            <div class="text-sm uppercase text-black/60 dark:text-white/60 mb-3">
              Preview
            </div>
            <article
              class="prose prose-neutral dark:prose-invert max-w-none min-h-[420px] break-words"
              innerHTML={markdownToHtml(note().body)}
            />
          </section>
        </Show>
      </div>

      <div class="text-xs text-black/60 dark:text-white/60">
        {statusText()}
      </div>
    </div>
  )
}
