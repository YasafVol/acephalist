import type { CollectionEntry } from "astro:content"

export type WorkoutPlanEntry = CollectionEntry<"workoutPlans">
export type ExerciseEntry = CollectionEntry<"exercises">
export type WorkoutDay = WorkoutPlanEntry["data"]["days"][number]
export type WorkoutBlock = WorkoutDay["blocks"][number]
export type WorkoutBlockGroup = {
  label: string
  blocks: WorkoutBlock[]
}

export function formatWorkoutDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function buildExerciseMap(exercises: ExerciseEntry[]) {
  return new Map(exercises.map((exercise) => [exercise.slug, exercise]))
}

export function resolveExerciseRefs(
  exerciseMap: Map<string, ExerciseEntry>,
  refs: string[],
) {
  return refs.map((ref) => {
    const exercise = exerciseMap.get(ref)

    if (!exercise) {
      throw new Error(`Missing exercise reference: ${ref}`)
    }

    return exercise
  })
}

export function getSeparatorLabel(separator: WorkoutBlock["separator"]) {
  if (separator === "slash") return " / "
  if (separator === "or") return " or "
  return null
}

export function groupWorkoutBlocks(blocks: WorkoutBlock[]) {
  const groups: WorkoutBlockGroup[] = []

  for (const block of blocks) {
    const label = block.slotLabel.match(/^[A-Z]+/)?.[0] ?? block.slotLabel
    const currentGroup = groups.at(-1)

    if (currentGroup?.label === label) {
      currentGroup.blocks.push(block)
      continue
    }

    groups.push({
      label,
      blocks: [block],
    })
  }

  return groups
}
