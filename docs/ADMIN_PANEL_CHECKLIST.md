# Dr. Samik Sharma — Admin panel release checklist

## Scope
The site has a Vite/React admin CMS backed by Firebase Authentication and a named Firestore database. **Admin access is not unlocked by the Vercel booking API.** Only a verified practice-owner Google account or an explicitly approved Firebase Auth UID can enter.

## Before release
1. Review the latest admin pull request and wait for all GitHub Actions jobs to pass (Bun tests, TypeScript check, Vite build).
2. Deploy the latest `firestore.rules` to the **correct named Firestore database** referenced by `firebase-applet-config.json` (`firestoreDatabaseId`). Merging the rules file in GitHub does **not** update Firebase.
3. In Firebase Authentication, enable Google sign-in and authorize the exact production Vercel domain.
4. Make sure Vercel serves the production branch/commit you merged. A green "Ready" result means it built; it does not prove authentication, Firestore permissions, or API functions work.
5. Keep `FIREBASE_SERVICE_ACCOUNT_JSON` and other server secrets in the protected Vercel Production environment only. Never share them in screenshots, logs, GitHub, or front-end variables.

## Smoke test
- Sign in at `/admin/login` with the verified practice owner account. Confirm the dashboard opens.
- Open `/admin/homepage`, `/admin/about`, `/admin/treatments`, `/admin/blog`, `/admin/media`, `/admin/settings`, and `/admin/appointments`.
- If records cannot load, the UI should show an error or unavailable indicator—not zero as if the clinic were empty.
- Check that an ordinary Google user cannot read private Firestore enquiries.
- For staff access: a staff member must sign in once to create a Firebase Auth account, then the owner can authorize that **existing** email in Practice Settings. Test another sign-in to verify permissions.
- When revoking staff access, confirm they no longer have access to admin pages or confidential data with a fresh login. Revocation depends on the updated Firestore rules being deployed.
- Verify that a failed or inaccessible role-management endpoint returns an error rather than claiming success.
- Do not use "Initialize Starter Content" without reviewing all medical content and explicitly approving the publication of any missing example pages.

## Known limitations
- Staff grant/revoke actions depend on the protected `/api/admin/set-role` Vercel endpoint. If Vercel Function logs show startup/runtime errors, that operation will remain unavailable until the API deployment is repaired. The verified owner can still log in to the CMS using Firebase Authentication.
- The current Media Library's local browser upload preview is **not persistent hosting**. Use approved, hosted image URLs in CMS until a secure permanent storage workflow is implemented.
- Appointment submissions depend on `/api/enquiries` and must be tested separately; this admin-focused change does not certify the booking API.
- Database connections, Firebase environment variables, and live administrative actions cannot be verified by a GitHub build alone.
