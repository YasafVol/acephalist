import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const contentRoot = path.join(root, "src", "content")

const publishedStubPatterns = [
  /lorem ipsum/i,
  /Astro Sphere/i,
  /astro-sphere-demo|markhorn-dev/i,
  /blog placeholder/i,
  /Starter notes, cues, and video slots/i,
  /This page is scaffolded/i,
  /Replace these starter|Capture your|Use this page|Record your preferred|Save your preferred|Add your preferred|Use this scaffold/i,
]

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(filePath) : [filePath]
  })
}

function isPublished(frontmatter) {
  return !/^draft:\s*true\s*$/m.test(frontmatter)
}

function getFrontmatter(fileContents) {
  return fileContents.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ""
}

const failures = []

for (const filePath of walk(contentRoot)) {
  if (!/\.(md|mdx)$/.test(filePath)) continue

  const contents = fs.readFileSync(filePath, "utf8")
  const frontmatter = getFrontmatter(contents)
  if (!isPublished(frontmatter)) continue

  const matchedPattern = publishedStubPatterns.find((pattern) => pattern.test(contents))
  if (matchedPattern) {
    failures.push(`${path.relative(root, filePath)} contains production-visible stub copy`)
  }
}

const exerciseLinksPath = path.join(root, "src", "components", "workouts", "ExerciseLinks.astro")
const exerciseLinks = fs.readFileSync(exerciseLinksPath, "utf8")
if (exerciseLinks.includes("/workouts/exercises/${exercise.slug}")) {
  failures.push("src/components/workouts/ExerciseLinks.astro still links to exercise detail pages")
}

const footer = fs.readFileSync(path.join(root, "src", "components", "Footer.astro"), "utf8")
if (/Astro Sphere|markhorn-dev/i.test(footer)) {
  failures.push("src/components/Footer.astro contains visible template credit")
}

const consts = fs.readFileSync(path.join(root, "src", "consts.ts"), "utf8")
if (/AUTHOR:\s*\"Mark Horn\"/.test(consts)) {
  failures.push("src/consts.ts still uses the template author")
}

if (failures.length > 0) {
  console.error("Production content audit failed:")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log("Production content audit passed.")
