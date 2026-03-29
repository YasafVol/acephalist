import { getNoteByShare } from "./_notes-store.mjs"

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const token = new URL(req.url).searchParams.get("token")
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const note = await getNoteByShare(token)
  if (!note) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    })
  }

  if (note.visibility === "private") {
    return new Response(JSON.stringify({ error: "Private note" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    })
  }

  return new Response(
    JSON.stringify({
      id: note.id,
      title: note.title || "Untitled note",
      body: note.body || "",
      summary: note.summary || "",
      tags: note.tags || [],
      updatedAt: note.updatedAt || null,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  )
}

export const config = {
  path: "/api/notes-share",
}
