import { canBypassAuth, getUserOrNull, saveVersion } from "./_notes-store.mjs"

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const user = getUserOrNull(context)
  if (!user && !canBypassAuth(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const { note, version } = await saveVersion(body || {}, user?.sub || null)
  return new Response(
    JSON.stringify({
      noteId: note.id,
      versionId: version.id,
      createdAt: version.createdAt,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  )
}

export const config = {
  path: "/api/notes-version",
}
