# Clinic staff notifications — deployment checklist

The website now supports **staff-only** email notifications through Resend:

1. A new enquiry email is sent only *after* Firestore saves the enquiry successfully.
2. A daily follow-up digest counts due/overdue enquiries still marked `new` or `contacted`.
3. Emails contain only a reference code or count. **No patient name, contact details, symptoms or medical history** are emailed.
4. Email failures do not turn a successfully saved enquiry into a failed form submission; provider failures are logged server-side.
5. No automatic emails, WhatsApp messages or SMS are sent to patients.

## Server-side environment variables

In the actual **server runtime** (not a Vite `VITE_*` client configuration), supply:

- `RESEND_API_KEY` — transactional email provider API key.
- `CLINIC_NOTIFICATION_FROM` — sender address on a verified domain (example `Clinic <notice@your-domain.com>`).
- `CLINIC_NOTIFICATION_TO` — dedicated clinic inbox approved to receive staff reminders.
- `FOLLOWUP_CRON_SECRET` — strong random secret, at least 32 characters (do not commit it).

Without all email variables, provider delivery is automatically disabled. Without a configured cron secret, the scheduled endpoint returns HTTP 503. Never add credentials to GitHub source or frontend variables.

The Express server needs server-side Firebase Admin credentials for the configured Firestore database. These must be supplied by the hosting platform. A static-only site build will not provide these API routes.

## GitHub Actions scheduler

Set these **GitHub repository Actions secrets**:

- `CLINIC_FOLLOWUP_URL` — the full HTTPS URL of the deployed `/api/cron/follow-ups` endpoint.
- `CLINIC_FOLLOWUP_CRON_SECRET` — exactly the same secret as the server's `FOLLOWUP_CRON_SECRET`.

The workflow `.github/workflows/follow-up-reminders.yml` runs at approximately **9 AM IST daily**. GitHub's scheduler may be delayed; it is not an exact-time service. You may also trigger the workflow manually to test.

The endpoint checks the bearer secret using a constant-time comparison, reads due follow-ups from private Firestore data, and records a daily dispatch marker to reduce duplicate sends. It refuses to send a partial digest if more than 500 candidate follow-ups are returned. The email provider's idempotency key protects against retries for up to 24 hours. This does not guarantee exactly-once delivery in every possible failure mode.

## Before launch

- Verify the sender domain and approved recipient inbox.
- Test the new-enquiry email with **dummy contact information only**.
- Test 0, 1, and multiple due follow-ups, the scheduler secret, and retry behavior using test data.
- Verify no notification is sent when Firebase fails to save a request.
- Ensure Firestore rules are deployed and least-privilege access to enquiries is enforced.
- Establish patient data retention/deletion procedures and review applicable privacy obligations.
- Do not promise appointment confirmation in automated messages.
- Avoid confusing staff reminders with confirmed clinical appointments.

In the admin dashboard, `/admin/appointments?followUp=due` opens the due-follow-up queue; existing priority and follow-up fields remain fully editable. The overview is currently limited to the latest 100 enquiries.
