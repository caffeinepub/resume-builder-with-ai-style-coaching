# Specification

## Summary
**Goal:** Add a clearly visible Internet Identity sign-in button to the unauthenticated landing screen so users can start the login flow.

**Planned changes:**
- Update the unauthenticated landing UI in `frontend/src/App.tsx` to render a primary button labeled "Sign in with Internet Identity" when `identity` is not present.
- Wire the button click to call `useInternetIdentity().login()`.
- Add a disabled/loading state for the button when `loginStatus` is `"logging-in"` (e.g., label changes to "Signing in…").
- Show an error message on the landing screen when `loginStatus` is `"loginError"` using existing UI patterns (e.g., `ErrorState`) while still allowing retry.

**User-visible outcome:** When signed out, users see a "Sign in with Internet Identity" button; clicking it starts Internet Identity authentication, with clear loading and error feedback.
