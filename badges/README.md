# 🏅 Frontend Mastery Hub — Badge System

This repository uses a structured badge system to recognize practical skills across the journey from beginner to distinguished frontend engineer.

Each badge has four tiers: 🥉 Bronze, 🥈 Silver, 🥇 Gold, 💎 Diamond. Tiers indicate increasing depth, scope, and independence.

## Badges at a Glance

| # | Badge | Domain | Bronze | Silver | Gold | Diamond |
|---|-------|--------|--------|--------|------|---------|
| 1 | DOM Tamer | Core JavaScript & Browser APIs | Select/modify DOM with `querySelector` & `.textContent` (L1) | Multi-step UI without frameworks (L4) | Event delegation + perf optimizations (L10) | Fully interactive app using only vanilla JS + DOM APIs (L20+) |
| 2 | CSS Whisperer | Styling, Layout, and Theming | Responsive layout with Flexbox (L2) | Flexbox + Grid complex layouts (L7) | Pixel-perfect accessible build from Figma (L12) | Publish responsive design system with theming & dark mode (L22+) |
| 3 | Logic Weaver | Programming Fundamentals | Solve problems with if/else + loops (L2) | Refactor into reusable functions (L5) | Efficient algorithms with better Big O (L14) | Personal utility library used across projects (L28+) |
| 4 | Async Ninja | Asynchronous Programming | Fetch with `fetch()` + `.then()` (L5) | `async/await` with try/catch (L6) | Parallelism with `Promise.all()` + caching (L15) | Architect advanced async flows (retry, cancel, offline-first) (L25+) |
| 5 | State Sculptor | State Management Mastery | React `useState` for local state (L12) | Context API for shared state (L13) | Optimized Redux/Zustand patterns (L17) | Multi-domain state across micro-frontends (L26+) |
| 6 | API Alchemist | Data Communication & APIs | Fetch + render REST data (L5) | Errors & retries (L8) | Integrate REST + GraphQL (L18) | Type-safe APIs with tRPC/GraphQL subs (L28+) |
| 7 | Performance Engineer | Speed & Optimization | Fix a rendering bottleneck (L15) | Pass CWV (LCP, FID, CLS) (L18) | Reduce bundle size by 30%+ (L23) | Performance budget enforced in CI/CD (L30+) |
| 8 | Accessibility Advocate | Inclusive Development | Semantic HTML + alt text (L6) | WCAG AA on a component (L9) | WCAG AAA on multi-step flow (L20) | Audit & improve full design system (L27+) |
| 9 | Security Sentinel | Frontend Security | Prevent basic XSS (L15) | CSRF protection in forms (L19) | Secure OAuth2/OIDC flow (L24) | Zero-trust frontend architecture (L35+) |
| 10 | Testing Tactician | QA & Testing | Unit test written and passed (L13) | Integration tests for a feature (L16) | >90% coverage with unit + E2E (L22) | Full testing strategy (unit/integration/E2E/contract) (L29+) |
| 11 | Toolsmith | Tooling & CI/CD | Configure Vite/Webpack (L14) | Basic CI pipeline with tests (L18) | Custom build plugin or CLI (L25) | Monorepo pipeline with CI/CD (L33+) |
| 12 | UX Strategist | UX & Design Thinking | Usability test + applied changes (L10) | Redesign with measurable UX gain (L16) | Lead full UX review (L24) | Org-level UX research strategy (L38+) |
| 13 | Innovation Catalyst | Emerging Tech | Feature with WebAssembly or WebXR (L22) | Integrate AI/ML in frontend (L28) | Ship AR/VR-capable web app (L36) | Invent a novel frontend tech (L45+) |
| 14 | Architect & Leader | System Design & Leadership | Lead small team project (L20) | Plan & execute large migration (L27) | Cross-team architecture leadership (L34) | Define org-wide technical strategy (L50) |

## How Unlocking Works

- Early levels (1–10): focus on 🥉 Bronze and some 🥈 Silver.
- Mid levels (11–25): unlock 🥇 Gold across more domains.
- Late levels (26–50): emphasize 💎 Diamond, advanced domains, and leadership.
- Badges are designed to unlock progressively across the full roadmap; maxing a badge typically requires reaching late Year 3.

## Source of Truth

The machine-readable catalog lives in `badges/badges.json`. Tools and scripts can consume it to:
- Render badge progress in dashboards
- Validate achievements in CI
- Generate learner profiles

## Ideas for Future Automation

- Lint PR descriptions for claimable criteria and auto-suggest badge updates
- Generate a profile badge wall from `badges.json`
- Track earliest-eligible level per user portfolio