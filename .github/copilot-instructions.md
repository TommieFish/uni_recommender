## Quick orientation for AI coding assistants

This file explains the important project-specific conventions, integration points, and workflows so an AI agent can be immediately productive.

1) Big picture
- This is a Next.js (App Router, Next v15) web app that stores user, student and university data in Supabase. UI lives under `src/app` and reusable pieces in `src/components`.
- Recommendation pipeline: student record -> student vector (`student_vectors`) and university/course vectors (`university_vectors`) -> similarity search producing `student_recommendation` rows.

2) Key files & where to look (examples)
- App layout and global wiring: `src/app/layout.tsx` and `src/app/globals.css`.
- Supabase server client (server-only): `src/lib/supabase/server.ts` — use `getSupabase()` in server components and API routes.
- Vector construction logic: `src/lib/algorithms/buildStudentVector.ts` and `src/lib/algorithms/buildUniversityVector.ts`.
- Normalisation & similarity helpers: `src/lib/algorithms/normalisation.ts`, `src/lib/algorithms/similarity.ts`, `src/lib/algorithms/vectorSimilarity.ts`.
- API endpoints to trigger operations: `src/app/api/generate-student-vector/route.ts`, `src/app/api/generate-university-vector/route.ts`, `src/app/api/run-similarity-search/route.ts`.

3) Important conventions and invariants (do not break)
- Vector length and index mapping are important: all algorithm files assume a fixed flattened vector length and order. The repository uses 9 values; index 2 is "distance" and gets special handling (calculated per-search and normalized at runtime). If you change vector shape, update:
  - `ahpWeightsVector` arrays in both `buildStudentVector.ts` and `buildUniversityVector.ts`
  - `normalizationConfig` arrays in the same files
  - any code that slices or indexes vectors (eg `vectorSimilarity.ts`).
- Database table names used directly: `students`, `university`, `course_for_uni`, `student_vectors`, `university_vectors`, `student_recommendation`. Keep column names consistent with existing queries when changing schema.

4) How the server-side auth + DB access works
- `getSupabase()` (server-only) uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the Next cookies store. Server components and API routes call it to access auth and DB.
- Many server functions call `supabase.auth.getUser()` then operate under that user context — missing or invalid auth leads to thrown errors.

5) Developer workflows and commands
- Install & run locally:
  - `npm install` then `npm run dev` (uses `next dev --turbopack`).
- Build for production: `npm run build` then `npm start`.
- Lint/format: `npm run lint` (biome) and `npm run format`.

6) How to trigger and debug the recommendation pipeline (examples)
- Generate student vector (server): POST to `/api/generate-student-vector` (server will upsert `student_vectors`). See `src/app/api/generate-student-vector/route.ts`.
- Generate all university/course vectors: POST to `/api/generate-university-vector` (creates/updates `university_vectors`). Use this when the university DB changes.
- Run similarity and save top-8 recommendations: POST JSON {"name":"LIST NAME"} to `/api/run-similarity-search`.
- Useful debug patterns: these server scripts log progress via console.log; inspect server logs / Vercel function logs or local terminal for messages like "Vector stored for..." or errors printed on DB upsert.

7) Database expectations & edge cases
- `entry_requirements_ucas_points` is stored as total points for 3 A-levels; code divides by 3 to get per-subject average. `required_grade` fields can be an array of objects describing subject + grade.
- Distance handling: university vectors store a placeholder distance (0) and the actual student-specific distance is computed and normalized at search time using `normalize(..., 'minmax')` and `minmax_student` for student value.

8) Testing and small edits guidance
- Small changes to vector math: write a targeted unit test that imports `normalize` or the algorithm file and validates output for sample inputs. There is no test harness in the repo currently — add tests under `__tests__` and use a small npm dev dependency if requested.

9) When updating behavior, what to change together
- If you alter AHP weights or normalization methods: update the corresponding arrays in both `buildStudentVector.ts` and `buildUniversityVector.ts`, and update comments in `vectorSimilarity.ts` that rely on index meaning.

10) Typical pitfalls for automation
- Do not assume vector element 2 is normalized in DB; it is updated at runtime in `vectorSimilarity.ts` (this is a deliberate design choice to personalise distance per-student).
- Avoid editing `getSupabase()` to require non-existent environment variables; the code expects the public keys in NEXT_PUBLIC_* vars.

If anything above is unclear or you want more detail in a specific area (DB schema, test harness, or CI), tell me which part to expand or provide schema files and I'll update this file accordingly.
