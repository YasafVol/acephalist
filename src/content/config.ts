import { defineCollection, z } from "astro:content"

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
})

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
  }),
})

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
  }),
})

const workoutPlans = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    days: z.array(z.object({
      dayLabel: z.string(),
      focus: z.string(),
      notes: z.string().optional(),
      blocks: z.array(z.object({
        slotLabel: z.string(),
        prescription: z.string(),
        exerciseRefs: z.array(z.string()).min(1),
        separator: z.enum(["single", "slash", "or"]).default("single"),
      })),
    })).min(1),
  }),
})

const exercises = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).default([]),
    keyPoints: z.array(z.string()).default([]),
    trainingCues: z.array(z.string()).default([]),
    youtubeLinks: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).default([]),
    aliases: z.array(z.string()).default([]),
    draft: z.boolean().optional(),
  }),
})

const legal = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
})

const about = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
})

export const collections = { work, blog, projects, workoutPlans, exercises, legal, about }
