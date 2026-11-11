# Deploy Dr. Samik Sharma Website to Vercel

This repository is a Vite/React SPA with a Firebase CMS and a private consultation-enquiry API.

## 1. Import the GitHub repository

1. Sign into https://vercel.com/new and click **Import Git Repository**.
2. Choose **Priyanshuprabhakar007/Dr-Samit-website** and branch **main**.
3. Choose **Vite** if prompted; use **root directory** `./`.
4. The repository contains `vercel.json` with the SPA fallback and default `dist` output.
5. Set Node.js version to **22.x or newer** in Vercel Project Settings if needed.

## 2. Configure server environment variables

Go to **Project → Settings → Environment Variables**, choose Production and Preview as appropriate, and add:

- `FIREBASE_SERVICE_ACCOUNT_JSON`: the exact JSON text of a Firebase service account for the project matching `firebase-applet-config.json`. Never put it in GitHub or a frontend `VITE_*` environment variable.
- `ENQUIRY_RATE_LIMIT_SECRET`: a cryptographically random secret of **at least 32 characters**. Use a password manager or `openssl rand -hex 32` on a trusted local machine.

Create the Firebase service account securely in the Firebase Console under **Project Settings → Service Accounts**. Restrict access to the secret and rotate/revoke it if exposed. Vercel must receive it as a **server-side** environment variable.

The Vercel API rejects consultation submissions if either required variable is missing; it does not fake a successful appointment request. No email/WhatsApp notifications or scheduled messaging are enabled.

**Do not provide these secrets in ChatGPT or commit them to the repository.**

## 3. Secure Firebase

- Deploy the repository's updated `firestore.rules` to the correct **named Firestore database**, not just the default database.
- Ensure Firebase Google Sign-In is enabled and add the Vercel domain to **Firebase Authentication → Settings → Authorized domains**.
- Keep public reads limited to published content, and require trusted admin role verification for private enquiries.
- Clinic account administrators should verify role assignments with Firebase custom claims and Firestore rules.
- Verify that Firebase Admin SDK has access to the configured Firestore database.

## 4. Test your deployment

After deployment, check the actual Vercel URL:

1. `/` loads the luxury homepage.
2. `/treatments` and `/treatments/rhinoplasty` load when opened directly in a new tab.
3. `/blog`, `/admin/login` and other deep links load without a 404.
4. `/api/health` responds `{"status":"ready"}` only after secrets are configured.
5. Google Sign-In works on your deployed domain.
6. Submit a **dummy** consultation enquiry, verify a 201 response and the saved Firestore record.
7. Confirm anonymous Firestore reads of private enquiries and direct public Firestore writes fail.
8. Check admin treatment/homepage editing and publication with test data.
9. Verify no automatic email notifications or follow-up cron jobs exist.
10. Check responsive layouts and image loading.

## Architecture and limitations

- Vite static build output is `dist`. Vercel serves individual files under `api/**` as serverless Node Functions.
- `server.ts` remains available for Google AI Studio/Express hosting, but Vercel uses the `api/**` functions; both should retain equivalent enquiry/auth behavior.
- Rate limiting is stored in a private Firestore collection `enquiry_rate_limits` and keyed using an HMAC secret. Configure a Firestore TTL policy on its `expiresAt` field to clean up old limit records.
- This is a legitimate request-only intake flow, not confirmed booking or a hospital patient record system.
- The CMS currently shows the most recent 100 enquiries. Do not claim its figures represent lifetime totals.
- Use Vercel deployment logs and browser network tools to investigate 404/500 errors; do not add private secrets to screenshots or public issues.

## Automatic deploys

Once Vercel is connected to the GitHub repository, pushes to `main` typically deploy automatically. Preview branches can be enabled in Vercel settings. You do not need to change Git branches or send a new build prompt in AI Studio.
