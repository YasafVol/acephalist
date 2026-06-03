# Decisions Tracker

## 2026-06-03: Fast Production Cleanup For Stub Content

Decision: keep unfinished content in the repo as drafts, but stop it from behaving like production content.

Actions:
- Mark inherited Astro Sphere tutorial posts, lorem project pages, and scaffolded exercise reference pages as drafts.
- Keep workout programme rows visible, but render exercise names as plain text until the exercise reference pages are rewritten.
- Resolve workout plan exercise references from all exercise entries so draft exercise pages can still supply display names.
- Filter drafts from blog/project detail routes and RSS, not only index/search pages.
- Add `npm run audit:production-content` as a guard against publishing obvious placeholder copy or reintroducing exercise detail links from the programme page.

Follow-up:
- Exercise pages can be populated from the SmartWorkout exercise library (`https://smartworkout.app/en/exercise-library/`) as a research source, but content should be rewritten in Acephalist's voice and not copied wholesale.
- When an exercise page is genuinely useful, change only that page back to `draft: false` and consider making programme exercise names clickable again.
