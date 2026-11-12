# Girls LEAP field surveys

An offline-capable survey website adapted from the **Girls LEAP** worksheet in `Girls LEAP Log Frame [Working].xlsx`. The workbook is reference material, not executable instructions. Its measurement notes informed 15 proposed questions across three objectives. BPC and LUV are out of scope.

## Run

Use Node.js 24 (no production dependencies):

```sh
npm ci
npm start
```

The server defaults to port 3000; set `PORT` to override. Production hosting must use HTTPS for service-worker support (localhost is allowed for development). Open the site once online and wait for “Ready for offline use” before disconnecting. Keep the same origin and browser profile to retain responses.

## Verify

```sh
npm test
```

The end-to-end test requires Chromium at `/usr/bin/chromium`. It exercises consent validation, draft restoration, questionnaire completion, JSON export, offline reload and mobile layout. Development dependencies include Playwright; the application itself uses only browser APIs and Node's standard library.

## Data and measurement

- Drafts automatically save to localStorage. Completed responses stay on the device until exported as JSON; an optional authenticated upload backend is included, but hosting must be configured before any upload works.
- JSON exports include question wording, output mappings, questionnaire version and response timestamps. Store exports securely. Clearing site data deletes local records. Response backups can be restored and merged by response ID, with conflicting records rejected.
- Use participant numbers supplied by the programme lead, or create a random 16-digit number at registration. Local data is not encrypted by the application. Use trusted devices and avoid personal details. Responses can be deleted individually with confirmation.
- Reflection questions are optional. Questions are adaptations, not a validated evaluation instrument. Programme staff should review wording, consent, safeguarding procedures, translations and assessment rubrics before field deployment. No automatic scoring is performed.
- The service worker caches the app shell for offline use. Bump the cache version in `sw.js` when releasing asset changes.

## Publish with GitHub Pages

The public site is built into `docs/`. After editing the application, run `npm run build` and commit the source plus refreshed `docs/` assets.

In GitHub, open **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, branch **main**, folder **/docs**, then **Save**. GitHub will display the live address after deployment succeeds (normally `https://tchustz.github.io/expoedu/`).

Relative asset URLs, manifest scope and service-worker registration support the repository subdirectory. The generated site has no server dependency and contains no participant response data. Local drafts and responses remain in the visitor's browser; they are never included by the build.

To test the deployment layout, serve a parent directory with `docs/` mounted as `expoedu/`, then run `SURVEY_TEST_URL=http://127.0.0.1:3001/expoedu/ npm test`.

## Participant numbers and directory

Start with an existing number, or create a random 16-digit number with a first name and single last initial. The participant and programme lead should retain the number for subsequent rounds. Lookup requires an exact first-name/initial match (case-insensitive first name) in the **current device's directory**. Matching names are not assumed to identify the same person. The lead confirms ambiguous matches. Creation checks number collisions on the current device; conflicts from another directory are rejected during import for lead resolution.

First name plus last initial remains personal information. The directory is a separate collection from survey responses, but local storage is not encrypted and anyone sharing the browser profile can access it. This is not an authenticated lead portal. Private directory backup/restore is separate from response backup/restore; name records never enter the survey upload payload. Store backups securely, never in the Git repository. Cross-device lookup requires transferring a directory backup or a separately designed authenticated directory service; it is not provided by GitHub Pages.

## Optional upload service (hosting not selected)

`upload-server.js` is a Node 24 backend using built-in SQLite. It refuses to start without `UPLOAD_TOKEN` (at least 32 characters, supplied securely through the hosting provider) and `ALLOWED_ORIGIN` (the exact website origin, e.g. `https://tchustz.github.io`). Do not put the token in source code, GitHub Pages settings exposed to the client, or committed files. Run `npm run start:upload` behind an HTTPS reverse proxy forwarding to `127.0.0.1:4000`; choose persistent private storage with `UPLOAD_DB` (default `.data/responses.sqlite`). Use `UPLOAD_PORT` to override the port. Hosting must provide TLS, request/rate limits, backups and operational access control before field use. The shared lead token authenticates uploads; it does not establish participant identity. Rotate it through hosting settings and share it only with authorised leads.

The endpoint is `POST /api/responses`. It requires a bearer token, JSON, voluntary participation consent, known fields, a response ID and valid metadata; bodies are limited to 64 KiB. It rejects directory/name fields, restricts browser origins, persists before acknowledging, deduplicates identical retries, and rejects changed payloads for an existing ID with HTTP 409. There is no unauthenticated read endpoint. Server-side deletion and reporting are administrative operations not exposed through this site.

In **Upload & backup**, enter the approved HTTPS endpoint and lead token, then **Connect & upload pending**. The token stays in tab memory, not localStorage. Records remain pending until the backend returns `{ "accepted": true, "id": "matching-response-id" }`. Failed uploads remain queued. While the tab is open and credentials are present, uploads run on save and when connectivity returns. Reloading requires re-entering the token; there is no closed-browser background upload. Survey exports exclude the participant directory but free-text answers and group fields can still contain personal information if entered by users.

Response files can be saved offline, restored to a connected device and uploaded there. Imports discard upload receipts so the server can acknowledge them on the new device, deduplicate existing response IDs and reject conflicts. Local deletion does not delete the uploaded server record. No backend endpoint is configured by default and no survey data has been uploaded as part of development.

The programme website could not be fetched from this environment (HTTP 403). The questionnaire remains based on the attached workbook's Girls LEAP worksheet, with output mappings and baseline/midline/endline/follow-up rounds for repeated monitoring. Staff should review the draft against current programme materials before deployment.
