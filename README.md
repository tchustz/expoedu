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

- Drafts automatically save to localStorage. Completed responses stay on the device until exported as JSON; no backend or automatic synchronisation is provided.
- JSON exports include question wording, output mappings, questionnaire version and response timestamps. Store exports securely. Clearing site data deletes local records. There is no import or cross-device merge yet.
- Use pseudonymous participant codes. Local data is not encrypted by the application. Use trusted devices and avoid personal details. Responses can be deleted individually with confirmation.
- Reflection questions are optional. Questions are adaptations, not a validated evaluation instrument. Programme staff should review wording, consent, safeguarding procedures, translations and assessment rubrics before field deployment. No automatic scoring is performed.
- The service worker caches the app shell for offline use. Bump the cache version in `sw.js` when releasing asset changes.

## Publish with GitHub Pages

The public site is built into `docs/`. After editing the application, run `npm run build` and commit the source plus refreshed `docs/` assets.

In GitHub, open **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, branch **main**, folder **/docs**, then **Save**. GitHub will display the live address after deployment succeeds (normally `https://tchustz.github.io/expoedu/`).

Relative asset URLs, manifest scope and service-worker registration support the repository subdirectory. The generated site has no server dependency and contains no participant response data. Local drafts and responses remain in the visitor's browser; they are never included by the build.

To test the deployment layout, serve a parent directory with `docs/` mounted as `expoedu/`, then run `SURVEY_TEST_URL=http://127.0.0.1:3001/expoedu/ npm test`.
