# Deploying Printed Dimensions for free

Stack:
- **Supabase** — Postgres database (with admin UI for editing data)
- **Render** — Spring Boot backend
- **Vercel** — React frontend
- **UptimeRobot** — pings Render every 5 min so the free instance doesn't sleep

Total time: ~25 minutes. Total cost: $0. None of these require a credit card on the free tier.

Do these phases in order.

---

## Phase A — Supabase (Postgres DB) · ~3 min

1. Go to **https://supabase.com** → "Start your project" → sign in with GitHub.
2. Click **New Project**.
   - Name: `printeddimensions` (or anything)
   - Database Password: **generate one and save it somewhere** — you'll need it in Phase B
   - Region: pick the one closest to you (e.g. South Asia – Mumbai or Singapore)
   - Plan: Free
3. Wait ~2 minutes for provisioning.
4. Project sidebar → **Settings (gear icon)** → **Database** → **Connection string** tab.
5. Mode: **Session pooler** is fine, or use the direct connection. Copy the URI shown.
   It looks like:
   ```
   postgresql://postgres.PROJECTREF:[YOUR-PASSWORD]@aws-0-REGION.pooler.supabase.com:5432/postgres
   ```
   (or the direct form `postgresql://postgres:[YOUR-PASSWORD]@db.PROJECTREF.supabase.co:5432/postgres`)

6. **Save these three pieces** — you'll paste them into Render:
   - **JDBC URL**: take the URI above and (a) prepend `jdbc:`, (b) replace `[YOUR-PASSWORD]` with nothing (we'll send password as a separate env var), (c) append `?sslmode=require` if it's not already there.

     Examples:
     ```
     jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
     jdbc:postgresql://db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require
     ```
   - **Username**: whatever appears before `:[YOUR-PASSWORD]` in the URI (usually `postgres` or `postgres.PROJECTREF`)
   - **Password**: the one you set in step 2

Phase A is done — don't close the Supabase tab, you'll use it later to view data.

---

## Phase B — Render (backend) · ~10 min

1. Go to **https://render.com** → sign up with GitHub.
2. Dashboard → **New +** → **Blueprint**.
3. Connect repository → select **AmeyaBhad/3D_printer-site**. Click "Connect".
4. Render finds [Backend/render.yaml](Backend/render.yaml) automatically and shows the env vars you need to fill in.
5. Fill in:
   - `SPRING_DATASOURCE_URL` = the JDBC URL from Phase A step 6
   - `SPRING_DATASOURCE_USERNAME` = the username from Phase A step 6
   - `SPRING_DATASOURCE_PASSWORD` = the password from Phase A step 6
   - `CORS_ALLOWED_ORIGINS` = leave blank for now (we'll fill after Phase C)
   - `SEED_ADMIN_PASSWORD` = pick a strong password (this becomes your admin login)
   - `SEED_USER_PASSWORD` = pick another (becomes the regular-user login)
   - leave `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `GOOGLE_CLIENT_ID` blank — fill later
6. Click **Apply** / **Create Blueprint**.
7. First build takes 5–10 minutes (Maven downloads ~200 MB of dependencies on first run). Watch the live log in Render's dashboard. Wait until status says **Live**.
8. **Copy your Render URL** — it looks like `https://printeddimensions-backend-XXXX.onrender.com`.
9. Verify by opening `https://printeddimensions-backend-XXXX.onrender.com/api/products` in your browser. You should see a JSON array of 8 seed products.

Phase B done.

---

## Phase C — Vercel (frontend) · ~5 min

1. Go to **https://vercel.com** → sign up with GitHub.
2. Dashboard → **Add New** → **Project**.
3. Import **AmeyaBhad/3D_printer-site**.
4. **Important configuration**:
   - **Root Directory**: click "Edit" and set to **`frontend`**
   - Framework Preset: should auto-detect as **Vite**. If not, set it manually.
   - Build Command: leave default (`npm run build`)
   - Output Directory: leave default (`dist`)
5. Expand **Environment Variables** and add:
   - Name: `VITE_API_BASE_URL`, Value: `https://printeddimensions-backend-XXXX.onrender.com/api` (use your actual Render URL from Phase B, **and don't forget the `/api` suffix**)
6. Click **Deploy**. Takes ~2 minutes.
7. **Copy your Vercel URL** — looks like `https://3d-printer-site-XXXX.vercel.app`.

Phase C done.

---

## Phase D — Connect frontend to backend · ~2 min

The backend currently rejects requests from your Vercel URL because of CORS. Fix it:

1. Back to **Render** → your `printeddimensions-backend` service → **Environment** tab.
2. Edit `CORS_ALLOWED_ORIGINS`:
   - Value: paste your Vercel URL (no trailing slash), e.g. `https://3d-printer-site-XXXX.vercel.app`
   - You can list multiple comma-separated, e.g. `https://3d-printer-site.vercel.app,https://3d-printer-site-git-main-yourname.vercel.app` (Vercel creates one URL per branch — add them all to be safe)
3. Save changes. Render redeploys automatically (~2 min).
4. Visit your Vercel URL once it redeploys. Products should load.

Phase D done.

---

## Phase E — UptimeRobot (keep-alive) · ~3 min

Render's free instance sleeps after 15 minutes of no traffic. UptimeRobot pings it every 5 min so it never sleeps.

1. **https://uptimerobot.com** → Free signup.
2. Dashboard → **+ Add New Monitor**.
3. Settings:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `Printed Dimensions backend`
   - URL: `https://printeddimensions-backend-XXXX.onrender.com/api/health`
   - Monitoring Interval: **5 minutes** (the free minimum)
4. Save.

Phase E done. Backend will stay warm 24/7.

---

## Phase F — Verify

Visit your Vercel URL:
1. Home page loads with all 8 products.
2. Login → use the `SEED_ADMIN_PASSWORD` you set in Phase B step 5 with email `admin@printeddimensions.com`.
3. Go to Admin page → analytics show real numbers.
4. Open Supabase dashboard → **Table Editor** → `products` → edit a product's price → refresh your site → new price shows. **That's the "edit DB to update site" flow you asked for.**

---

## Adding features later (Razorpay, Google login, smarter chatbot)

Each is just env vars in Render — no redeploy needed beyond Render's auto-restart.

| Feature | Env vars to add in Render |
|---|---|
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| Google login (backend audience check) | `GOOGLE_CLIENT_ID` |
| Google login (frontend button) | Add `VITE_GOOGLE_CLIENT_ID` in **Vercel** env vars + redeploy |

See [SETUP.md](SETUP.md) for where to actually get these values.

---

## Troubleshooting

**Render build fails with "JAVA_HOME not set" or Java version error**
- In Render service → Environment, ensure `JAVA_VERSION=17` is set.

**Render starts but backend logs show `JdbcSQLException` or "connection refused"**
- Most likely the Supabase JDBC URL is missing `?sslmode=require`. Add it.
- Or the password has special characters that need URL-encoding in the URL — but since we send password as a separate env var (not in the URL), this shouldn't bite us.

**Frontend loads but shows "Failed to load products"**
- Open browser DevTools → Network tab → look at the failed request.
- If you see a CORS error, `CORS_ALLOWED_ORIGINS` in Render doesn't match your Vercel URL exactly. Trailing slashes matter.
- If you see "blocked by mixed content", Render is on HTTPS but the env var has `http://`. Use `https://` for the Render URL.

**Supabase says "Database paused"**
- Free Supabase projects pause after 7 days of inactivity. Click "Restore" in their dashboard.

**Render says "Resource limit reached"**
- Free tier gives 750 hours/month. With UptimeRobot keeping it warm 24/7, that's ~720 hours — close to the limit. You'll get a warning before it hits zero.
