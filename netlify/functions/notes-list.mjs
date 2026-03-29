import { canBypassAuth, getUserOrNull, listNotesForOwner } from "./_notes-store.mjs"

export default async (req, context) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const user = getUserOrNull(context)
  if (!user && !canBypassAuth(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    })
  }

  const ownerId = user?.sub || "local-dev"
  const notes = await listNotesForOwner(ownerId)
  return new Response(JSON.stringify({ notes }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

export const config = {
  path: "/api/notes-list",
}
