declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"about": {
"index.md": {
	id: "index.md";
  slug: "index";
  body: string;
  collection: "about";
  data: InferEntrySchema<"about">
} & { render(): Render[".md"] };
};
"blog": {
"01-astro-sphere-file-structure/index.md": {
	id: "01-astro-sphere-file-structure/index.md";
  slug: "01-astro-sphere-file-structure";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"02-astro-sphere-getting-started/index.md": {
	id: "02-astro-sphere-getting-started/index.md";
  slug: "02-astro-sphere-getting-started";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"03-astro-sphere-add-new-post-or-projects/index.md": {
	id: "03-astro-sphere-add-new-post-or-projects/index.md";
  slug: "03-astro-sphere-add-new-post-or-projects";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"04-astro-sphere-writing-markdown/index.md": {
	id: "04-astro-sphere-writing-markdown/index.md";
  slug: "04-astro-sphere-writing-markdown";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"05-astro-sphere-writing-mdx/index.mdx": {
	id: "05-astro-sphere-writing-mdx/index.mdx";
  slug: "05-astro-sphere-writing-mdx";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"06-astro-sphere-social-links/index.md": {
	id: "06-astro-sphere-social-links/index.md";
  slug: "06-astro-sphere-social-links";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"07-pm-superpowers/index.md": {
	id: "07-pm-superpowers/index.md";
  slug: "07-pm-superpowers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"08-ai-spell-casting/index.md": {
	id: "08-ai-spell-casting/index.md";
  slug: "08-ai-spell-casting";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};
"exercises": {
"barbell-hip-thrust.md": {
	id: "barbell-hip-thrust.md";
  slug: "barbell-hip-thrust";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"barbell-shrug.md": {
	id: "barbell-shrug.md";
  slug: "barbell-shrug";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"bird-dog.md": {
	id: "bird-dog.md";
  slug: "bird-dog";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"bulgarian-split-squat.md": {
	id: "bulgarian-split-squat.md";
  slug: "bulgarian-split-squat";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"chest-supported-db-row.md": {
	id: "chest-supported-db-row.md";
  slug: "chest-supported-db-row";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"chin-tuck.md": {
	id: "chin-tuck.md";
  slug: "chin-tuck";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"close-grip-bench-press.md": {
	id: "close-grip-bench-press.md";
  slug: "close-grip-bench-press";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"crunches.md": {
	id: "crunches.md";
  slug: "crunches";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"db-bench-press.md": {
	id: "db-bench-press.md";
  slug: "db-bench-press";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"db-fly.md": {
	id: "db-fly.md";
  slug: "db-fly";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"db-hip-thrust.md": {
	id: "db-hip-thrust.md";
  slug: "db-hip-thrust";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"db-pullover.md": {
	id: "db-pullover.md";
  slug: "db-pullover";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"db-shrug.md": {
	id: "db-shrug.md";
  slug: "db-shrug";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"dead-bug.md": {
	id: "dead-bug.md";
  slug: "dead-bug";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"drag-curl.md": {
	id: "drag-curl.md";
  slug: "drag-curl";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"ez-bar-curl.md": {
	id: "ez-bar-curl.md";
  slug: "ez-bar-curl";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"forearm-extensor-work.md": {
	id: "forearm-extensor-work.md";
  slug: "forearm-extensor-work";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"forearm-flexor-work.md": {
	id: "forearm-flexor-work.md";
  slug: "forearm-flexor-work";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"french-curl.md": {
	id: "french-curl.md";
  slug: "french-curl";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"hammer-curl.md": {
	id: "hammer-curl.md";
  slug: "hammer-curl";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"hamstring-sliders.md": {
	id: "hamstring-sliders.md";
  slug: "hamstring-sliders";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"hamstring-walkouts.md": {
	id: "hamstring-walkouts.md";
  slug: "hamstring-walkouts";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"hard-side-plank-variation.md": {
	id: "hard-side-plank-variation.md";
  slug: "hard-side-plank-variation";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"incline-db-bench-press.md": {
	id: "incline-db-bench-press.md";
  slug: "incline-db-bench-press";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"incline-db-curl.md": {
	id: "incline-db-curl.md";
  slug: "incline-db-curl";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"landmine-row.md": {
	id: "landmine-row.md";
  slug: "landmine-row";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"landmine-split-squat.md": {
	id: "landmine-split-squat.md";
  slug: "landmine-split-squat";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"landmine-squat.md": {
	id: "landmine-squat.md";
  slug: "landmine-squat";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"lateral-raise.md": {
	id: "lateral-raise.md";
  slug: "lateral-raise";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"lying-db-leg-curl.md": {
	id: "lying-db-leg-curl.md";
  slug: "lying-db-leg-curl";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"neck-flexion-isometric.md": {
	id: "neck-flexion-isometric.md";
  slug: "neck-flexion-isometric";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"neck-side-flexion-isometric.md": {
	id: "neck-side-flexion-isometric.md";
  slug: "neck-side-flexion-isometric";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"one-arm-db-row-braced.md": {
	id: "one-arm-db-row-braced.md";
  slug: "one-arm-db-row-braced";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"overhead-triceps-extension.md": {
	id: "overhead-triceps-extension.md";
  slug: "overhead-triceps-extension";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"pec-stretch.md": {
	id: "pec-stretch.md";
  slug: "pec-stretch";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"pronation-supination.md": {
	id: "pronation-supination.md";
  slug: "pronation-supination";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"pull-ups.md": {
	id: "pull-ups.md";
  slug: "pull-ups";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"rear-delt-fly.md": {
	id: "rear-delt-fly.md";
  slug: "rear-delt-fly";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"reverse-lunge.md": {
	id: "reverse-lunge.md";
  slug: "reverse-lunge";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"scapular-retractions.md": {
	id: "scapular-retractions.md";
  slug: "scapular-retractions";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"side-plank.md": {
	id: "side-plank.md";
  slug: "side-plank";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"squeeze-press.md": {
	id: "squeeze-press.md";
  slug: "squeeze-press";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"standing-calf-raise.md": {
	id: "standing-calf-raise.md";
  slug: "standing-calf-raise";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"suitcase-carry.md": {
	id: "suitcase-carry.md";
  slug: "suitcase-carry";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"suitcase-hold.md": {
	id: "suitcase-hold.md";
  slug: "suitcase-hold";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"sumo-deadlift.md": {
	id: "sumo-deadlift.md";
  slug: "sumo-deadlift";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"thoracic-rotation.md": {
	id: "thoracic-rotation.md";
  slug: "thoracic-rotation";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"walk.md": {
	id: "walk.md";
  slug: "walk";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
"wrist-flexor-eccentric.md": {
	id: "wrist-flexor-eccentric.md";
  slug: "wrist-flexor-eccentric";
  body: string;
  collection: "exercises";
  data: InferEntrySchema<"exercises">
} & { render(): Render[".md"] };
};
"legal": {
"privacy.md": {
	id: "privacy.md";
  slug: "privacy";
  body: string;
  collection: "legal";
  data: InferEntrySchema<"legal">
} & { render(): Render[".md"] };
"terms.md": {
	id: "terms.md";
  slug: "terms";
  body: string;
  collection: "legal";
  data: InferEntrySchema<"legal">
} & { render(): Render[".md"] };
};
"projects": {
"project-1/index.md": {
	id: "project-1/index.md";
  slug: "project-1";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"project-2/index.md": {
	id: "project-2/index.md";
  slug: "project-2";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"project-3/index.md": {
	id: "project-3/index.md";
  slug: "project-3";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"project-4/index.md": {
	id: "project-4/index.md";
  slug: "project-4";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"project-5/index.md": {
	id: "project-5/index.md";
  slug: "project-5";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
};
"work": {
"adkit.md": {
	id: "adkit.md";
  slug: "adkit";
  body: string;
  collection: "work";
  data: InferEntrySchema<"work">
} & { render(): Render[".md"] };
"bank-hapoalim.md": {
	id: "bank-hapoalim.md";
  slug: "bank-hapoalim";
  body: string;
  collection: "work";
  data: InferEntrySchema<"work">
} & { render(): Render[".md"] };
"deloitte.md": {
	id: "deloitte.md";
  slug: "deloitte";
  body: string;
  collection: "work";
  data: InferEntrySchema<"work">
} & { render(): Render[".md"] };
"eldritch-foundry.md": {
	id: "eldritch-foundry.md";
  slug: "eldritch-foundry";
  body: string;
  collection: "work";
  data: InferEntrySchema<"work">
} & { render(): Render[".md"] };
"wix.md": {
	id: "wix.md";
  slug: "wix";
  body: string;
  collection: "work";
  data: InferEntrySchema<"work">
} & { render(): Render[".md"] };
};
"workoutPlans": {
"april-2026-programme.md": {
	id: "april-2026-programme.md";
  slug: "april-2026-programme";
  body: string;
  collection: "workoutPlans";
  data: InferEntrySchema<"workoutPlans">
} & { render(): Render[".md"] };
"foundation-split.md": {
	id: "foundation-split.md";
  slug: "foundation-split";
  body: string;
  collection: "workoutPlans";
  data: InferEntrySchema<"workoutPlans">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
