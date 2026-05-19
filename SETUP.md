# 3DForge — accounts & setup checklist

Personal cheat-sheet for everything you need to sign up for, in priority order.
Everything below has a free tier sufficient for this project.

---

## 🟢 To make features work locally (right now)

### 1. Razorpay — payments
- [ ] Sign up at https://razorpay.com (no business docs needed for test mode)
- [ ] Dashboard → **Settings → API Keys** → "Generate Test Key"
- [ ] Copy **Key Id** (`rzp_test_xxxxxxxxxxxx`) and **Key Secret**
- [ ] In Eclipse: Run Configurations → backend app → **Environment** tab → add
  - `RAZORPAY_KEY_ID` = your key id
  - `RAZORPAY_KEY_SECRET` = your key secret
- [ ] Restart backend → cart should now say "Pay with Razorpay"
- [ ] Test card: `4111 1111 1111 1111`, any future expiry, any CVV

### 2. Google Cloud Console — Sign in with Google
- [ ] Sign in at https://console.cloud.google.com with any Gmail
- [ ] Top-left → "Select a project" → **New Project** ("3DForge") → Create
- [ ] **APIs & Services → OAuth consent screen**
  - User Type: **External** → fill in app/support/dev emails → Save
  - "Test users" → add your Gmail
- [ ] **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
  - Application type: **Web application**
  - Authorized JavaScript origins:
    - `http://localhost:5173`
    - `http://127.0.0.1:5173`
  - Copy the **Client ID** (ends in `.apps.googleusercontent.com`)
- [ ] Create `frontend/.env`:
  ```
  VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
  ```
- [ ] (Optional) Set `GOOGLE_CLIENT_ID` env var on backend too, for audience check
- [ ] Restart Vite → "Continue with Google" button is live

---

## 🟡 When you decide to host (later)

| Service | What for | Free tier |
|---|---|---|
| Neon | Postgres database | 0.5 GB, always-on |
| Render | Backend (Spring Boot) | 750 hrs/mo, sleeps after 15 min idle |
| Vercel | Frontend (Vite/React) | Generous |
| UptimeRobot | Pings Render to keep it warm | 50 monitors, 5 min intervals |

None of these require a credit card on the free tier. Ping me when ready — backend is already wired for env-var config.

---

## 🔵 Optional upgrades

| If you want… | You'd need | Cost |
|---|---|---|
| Smarter chatbot (real AI) | Anthropic or OpenAI API key | ~$0.01-0.05 per chat |
| Real payments (not test mode) | Razorpay live keys (KYC: PAN + bank + business proof) | 2% per transaction |
| Custom domain | Namecheap / Porkbun | ~$10/year |
| Email notifications | Resend or SendGrid | Free up to 3000 emails/mo |

---

## Where things live

| Setting | Location |
|---|---|
| Backend env vars (local dev) | Eclipse Run Configurations → Environment tab |
| Backend env vars (hosted) | Render dashboard → Environment |
| Frontend env vars (local dev) | `frontend/.env` (gitignored) |
| Frontend env vars (hosted) | Vercel dashboard → Settings → Environment Variables |

## Seed accounts (admin / regular user)

Passwords are **not** hardcoded — set them via env vars before first run so admin/user
get auto-created on startup. Without these, no seed users are created and you'll
need to register via the UI.

```
SEED_ADMIN_PASSWORD=your-chosen-password
SEED_USER_PASSWORD=your-chosen-password
```

(Defaults: `SEED_ADMIN_EMAIL=admin@3dforge.com`, `SEED_USER_EMAIL=user@3dforge.com` —
override those env vars if you want different addresses.)
