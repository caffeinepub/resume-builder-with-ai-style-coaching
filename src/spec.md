# Specification

## Summary
**Goal:** Build a resume builder that lets users create and manage their own resumes, preview/export them, and receive deterministic “AI-style” coaching suggestions that persist per resume.

**Planned changes:**
- Implement backend data models and stable persistence for resumes with per-Principal CRUD access control.
- Build a resume editor UI with structured sections (Basics/Contact, Summary, Work Experience, Education, Skills), including add/edit and reorder for repeating entries.
- Add a live, print-friendly resume preview with an Export action that opens the browser print dialog (PDF via print).
- Implement deterministic coaching heuristics that generate reproducible, actionable suggestions grouped by section/category (no external AI/LLM calls).
- Persist latest coaching run results per resume (timestamp + suggestions) and show them when revisiting; allow re-running coaching with a consistent overwrite/append approach.
- Create an app shell with navigation (Resume List, Editor/Preview, Coaching) using React Query for all reads/writes with consistent loading/error states; support duplicate/delete/open from the list.
- Define and apply a cohesive professional editorial theme (avoid blue/purple as primary colors) across all pages.
- Add and display generated static assets (logo + empty-state illustration) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can create, edit, reorder, and save multiple resumes; see a live preview and export to PDF via print; run coaching to get sectioned suggestions that are saved and re-shown later; and navigate the app with a consistent themed UI and branded header/empty state.
