# Lab 5 — Patient API

Node.js backend using native HTTP routing, JavaScript classes, and MySQL through mysql2. The frontend is maintained separately at https://github.com/luluj2024/COMP4537-Lab5-Client.

## Run

Use Node.js 22.9 or later. Run `npm ci`, configure the variables listed in `.env.example`, then run `npm start`. Locally, copy `.env.example` to `.env` and supply the real database credentials privately. Never commit `.env`.

## Heroku

This repository has `package.json` and `Procfile` at its root and is ready to connect to a Heroku app.

1. Connect this repository in the app's Deploy settings.
2. Add `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_SSL`, `DB_WRITER_USER`, `DB_WRITER_PASSWORD`, `DB_READER_USER`, and `DB_READER_PASSWORD` as Config Vars using the privately supplied credentials. Keep `DB_SSL=true` for the current Aiven database; `ca.pem` supplies its CA certificate.
3. Set `CLIENT_ORIGIN=https://luluj2024.github.io` for the frontend's default GitHub Pages origin. Do not include the repository path or a trailing slash. Use the actual frontend origin if a custom domain is configured.
4. Deploy and enable a web dyno on your available plan. Heroku supplies `PORT`; the Procfile starts `node js/script.js`.
5. Put the actual backend HTTPS origin into the frontend's `API_BASE_URL`, then publish the frontend through GitHub Pages.

The database is already hosted separately on Aiven. Heroku hosts the API process. A 404 at `/` is expected.

## API

- `POST /lab5/api/v1/sql`: no body required. Ensures the database and InnoDB patient table exist, then inserts four fixed sample rows. Each successful request adds four rows.
- `GET /lab5/api/v1/sql/` followed by `encodeURIComponent(sql)`: executes visitor SQL using the SELECT-only account. Returns JSON containing `columns` and `rows`; errors contain `error`.
- Example: `https://YOUR-BACKEND-HOST/lab5/api/v1/sql/SELECT%20%2A%20FROM%20patient`.

The writer requires CREATE and INSERT on the configured database; the reader requires only SELECT. All visitor SQL uses the reader. Database permissions enforce protection against modification. Live grants and the existing table's InnoDB engine were verified on October 17, 2026. Hosted end-to-end tests and table recreation still need verification after deployment. Compare sample values and schema against the original assignment screenshots.

For submission, place the frontend in `T5Lab5/server1` and this backend in `T5Lab5/server2`, excluding `.git`, `node_modules`, and local secrets. Post both actual HTTPS application URLs, including the encoded sample GET URL, in Learning Hub.

ChatGPT (https://chat.openai.com/) assisted with this assignment.

References: [Heroku Node.js deployment](https://devcenter.heroku.com/articles/deploying-nodejs), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
