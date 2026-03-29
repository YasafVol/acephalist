import { getStore } from "@netlify/blobs"

const notesStore = getStore("scratchpad-notes")
const shareStore = getStore("scratchpad-share")
const versionsStore = getStore("scratchpad-versions")

function randomId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function slugify(input) {
  const base = String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
  return base || "untitled-note"
}

function token() {
  return Math.random().toString(36).slice(2, 12)
}

function nowIso() {
  return new Date().toISOString()
}

export function canBypassAuth(req) {
  const url = new URL(req.url)
  const isLocalHost =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "::1"
  return isLocalHost || process.env.NETLIFY_DEV === "true"
}

export function getUserOrNull(context) {
  return context?.clientContext?.user || null
}

export async function getNoteById(id) {
  if (!id) return null
  return notesStore.get(`notes/${id}.json`, { type: "json" })
}

export async function getNoteByShare(shareKey) {
  const pointer = await shareStore.get(`share/${shareKey}.json`, { type: "json" })
  if (!pointer?.id) return null
  return getNoteById(pointer.id)
}

export async function listNotesForOwner(ownerId) {
  if (!ownerId) return []
  const out = []
  for await (const page of notesStore.list({ paginate: true, prefix: "notes/" })) {
    for (const blob of page.blobs || []) {
      const note = await notesStore.get(blob.key, { type: "json" })
      if (note?.ownerId === ownerId) {
        out.push({
          id: note.id,
          title: note.title || "Untitled note",
          slug: note.slug,
          visibility: note.visibility || "public",
          updatedAt: note.updatedAt || note.createdAt || null,
        })
      }
    }
  }
  out.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
  return out
}

export async function upsertNote(input, ownerIdOrNull) {
  const existing = input.id ? await getNoteById(input.id) : null
  const id = existing?.id || input.id || randomId()
  const title = String(input.title || existing?.title || "Untitled note")
  const slug = slugify(input.slug || title || existing?.slug || "untitled-note")
  const shareToken = String(input.shareToken || existing?.shareToken || token())
  const visibility = input.visibility === "private" ? "private" : "public"
  const createdAt = existing?.createdAt || nowIso()
  const updatedAt = nowIso()
  const note = {
    id,
    slug,
    shareToken,
    title,
    body: String(input.body || ""),
    summary: String(input.summary || ""),
    tags: Array.isArray(input.tags) ? input.tags : String(input.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    visibility,
    createdAt,
    updatedAt,
    ownerId: existing?.ownerId || ownerIdOrNull || "local-dev",
  }
  const shareKey = `${slug}-${shareToken}`
  await notesStore.setJSON(`notes/${id}.json`, note)
  await shareStore.setJSON(`share/${shareKey}.json`, { id, visibility })
  return note
}

export async function saveVersion(input, ownerIdOrNull) {
  const note = await upsertNote(input, ownerIdOrNull)
  const versionId = randomId()
  const createdAt = nowIso()
  const version = {
    id: versionId,
    noteId: note.id,
    createdAt,
    title: note.title,
    body: note.body,
    previousVersionId: input.previousVersionId || null,
  }
  await versionsStore.setJSON(`versions/${note.id}/${versionId}.json`, version)
  return { note, version }
}
