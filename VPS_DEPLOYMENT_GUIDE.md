# 🚀 Buildroonix ERP — VPS Deployment Guide

> This is a full step-by-step guide to take the app from your local machine to a live VPS server from scratch.

---

## 1. What Your VPS Needs (Requirements)

### Recommended VPS Specs
| Item | Minimum | Recommended |
|------|---------|-------------|
| RAM | 2 GB | 4 GB |
| CPU | 1 vCPU | 2 vCPU |
| Storage | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### Software to Install on VPS
You need to install these 4 things:

```
1. Node.js v20+          (runs backend & frontend)
2. PostgreSQL 15+         (database)
3. PM2                    (keeps your app running in background)
4. Nginx                  (reverse proxy, public web server)
```

Optional but recommended:
```
5. Certbot               (free HTTPS/SSL with Let's Encrypt)
6. UFW (firewall)        (block all ports except 80 and 443)
```

---

## 2. Step-by-Step Installation on VPS

### Step 1 — Login to your VPS
```bash
ssh root@YOUR_VPS_IP
```

---

### Step 2 — Install Node.js v20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v      # should show v20.x.x
npm -v       # should show 10.x.x
```

---

### Step 3 — Install PostgreSQL
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE USER buildroonix_user WITH PASSWORD 'YOUR_STRONG_DB_PASSWORD';
CREATE DATABASE buildroonix_erp OWNER buildroonix_user;
GRANT ALL PRIVILEGES ON DATABASE buildroonix_erp TO buildroonix_user;
\q
EOF
```

> ⚠️ **Replace `YOUR_STRONG_DB_PASSWORD` with a real password. Write it down — you need it for `.env`.**

---

### Step 4 — Install PM2 (process manager)
```bash
sudo npm install -g pm2
pm2 startup    # Run the command it outputs to auto-start on reboot
```

---

### Step 5 — Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### Step 6 — Install Certbot (Free SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 3. Upload Your Project to VPS

### Option A — Using Git (Recommended)
```bash
# On VPS
cd /var/www
git clone https://github.com/YOUR_USERNAME/buildroonix-erp.git
# OR if private repo:
git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/buildroonix-erp.git

cd buildroonix-erp
```

### Option B — Using SCP from your local machine
```bash
# Run this on your LOCAL machine, not VPS
scp -r /home/pawan/Desktop/Buildroonix_ERP_Clean root@YOUR_VPS_IP:/var/www/buildroonix-erp
```

---

## 4. Configure Environment Variables

### Step A — Generate secure secrets FIRST
On your VPS, run these commands to generate secrets:

```bash
# Generate JWT_SECRET (64-character random string)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate ENCRYPTION_KEY (32-byte hex — for payment API key encryption)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> 📋 **Copy both outputs and save them securely before proceeding.**

---

### Step B — Create the Backend `.env` file
```bash
cd /var/www/buildroonix-erp/backend
nano .env
```

Paste this template and fill in ALL values:

```env
# ─── DATABASE ─────────────────────────────────────────────────
DATABASE_URL=postgresql://buildroonix_user:YOUR_STRONG_DB_PASSWORD@localhost:5432/buildroonix_erp

# ─── AUTHENTICATION ───────────────────────────────────────────
JWT_SECRET=PASTE_YOUR_64_CHAR_SECRET_HERE
JWT_EXPIRES_IN=15m

# ─── SERVER ───────────────────────────────────────────────────
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# ─── ENCRYPTION (for SMS/Payment API Keys stored in DB) ───────
ENCRYPTION_KEY=PASTE_YOUR_32_BYTE_HEX_HERE

# ─── SUPERADMIN SEED (used ONCE to create the first login) ────
SUPERADMIN_EMAIL=admin@yourdomain.com
SUPERADMIN_PASSWORD=YourVeryStrongPassword123!
SUPERADMIN_NAME=Platform Admin

# ─── LOGGING ──────────────────────────────────────────────────
LOG_LEVEL=info

# ─── FILE UPLOADS ─────────────────────────────────────────────
UPLOAD_DIR=/var/www/buildroonix-erp/uploads
```

> 🔐 **After the first deployment, remove or comment out the SUPERADMIN_* lines from .env so no one can re-seed by accident.**

---

### Step C — Create the Frontend `.env.local` file
```bash
cd /var/www/buildroonix-erp
nano .env.local
```

```env
# The internal URL of your backend (Nginx will proxy public requests)
API_INTERNAL_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 5. Install Dependencies & Build

### Backend
```bash
cd /var/www/buildroonix-erp/backend
npm install
npm run build     # compiles TypeScript → dist/
```

### Frontend (Next.js)
```bash
cd /var/www/buildroonix-erp
npm install
npm run build     # creates the .next production build
```

---

## 6. Setup the Database

```bash
cd /var/www/buildroonix-erp/backend

# Generate Prisma client
npx prisma generate

# Run all migrations (creates all tables)
npx prisma migrate deploy

# ──────────────────────────────────────────
# 🔑 CREATE THE SUPERADMIN (FIRST TIME ONLY)
# ──────────────────────────────────────────
npx ts-node prisma/seed.ts
# OR if using compiled build:
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
require('dotenv').config();
const email = process.env.SUPERADMIN_EMAIL;
const pwd = process.env.SUPERADMIN_PASSWORD;
bcrypt.hash(pwd, 12).then(hash => {
  return prisma.user.create({ data: { name: 'Super Admin', email, password: hash, role: 'superadmin' }});
}).then(u => { console.log('Created:', u.email); prisma.\$disconnect(); });
"
```

**After this step you will see:**
```
✅  Super Admin created:
    Email: admin@yourdomain.com
    Role:  superadmin
    ID:    xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 7. Start Applications with PM2

```bash
# Start Backend
cd /var/www/buildroonix-erp
pm2 start backend/dist/index.js --name "buildroonix-backend"

# Start Frontend
pm2 start "npm run start" --name "buildroonix-frontend" -- --port 3000

# Save PM2 process list (survives reboots)
pm2 save
pm2 list   # verify both are showing 'online'
```

---

## 8. Configure Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/buildroonix
```

Paste this (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (Next.js on port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Express on port 5000)
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Increase limit for file uploads
        client_max_body_size 50M;
    }

    # Static file uploads served directly
    location /uploads/ {
        alias /var/www/buildroonix-erp/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/buildroonix /etc/nginx/sites-enabled/
sudo nginx -t    # test config — should say "ok"
sudo systemctl reload nginx
```

---

## 9. Enable Free HTTPS (SSL)

```bash
# Make sure your domain DNS is already pointing to your VPS IP
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts. Certbot will automatically update your Nginx config.
# Auto-renewal is set up automatically.
```

---

## 10. Setup Firewall (UFW)

```bash
sudo ufw allow OpenSSH       # IMPORTANT: always allow SSH first
sudo ufw allow 'Nginx Full'  # allow HTTP + HTTPS
sudo ufw enable
sudo ufw status
```

---

## 11. Create Uploads Directory

```bash
mkdir -p /var/www/buildroonix-erp/uploads
chmod 755 /var/www/buildroonix-erp/uploads
```

---

## 12. First Login Workflow (After Deployment)

Once the app is live at `https://yourdomain.com`:

### Step 1 — Login as Superadmin
- URL: `https://yourdomain.com/login`
- Email: `admin@yourdomain.com` (value you set in `.env`)
- Password: the `SUPERADMIN_PASSWORD` you set

### Step 2 — Onboard Your First Institution
- Go to: **Superadmin → Institutions → Add New Institution**
- Fill: Institution Name, Unique Slug (e.g. `greenwood`), Type (School/College etc.), Plan
- Fill: Institution Admin Name, Email, and Password
- Click **Create Institution** → the admin account is created instantly

### Step 3 — Share Credentials with the Institution Admin
Give the institution admin:
- Login URL: `https://yourdomain.com/login`
- Email: (what you entered above)
- Password: (what you entered above)
- Institution Code: the slug (e.g. `greenwood`) — teachers/students need this to register

### Step 4 — Enable Premium Features Per Institution (Optional)
- Go to: **Superadmin → Institutions → Manage Modules** on any institution card
- Toggle `Online Payment Gateway` and/or `SMS & WhatsApp Notifications` ON
- The institution admin's sidebar will then show those menu items

### Step 5 — Institution Admin Configures Their APIs
Once the institution admin logs in:
- Go to: **Integrations & APIs** (visible only if Superadmin enabled it)
- Add Razorpay Key ID + Secret (for online fee payments)
- Add MSG91 or Twilio credentials (for SMS)
- Add Twilio WhatsApp credentials
- All keys are stored **encrypted** — never visible again after saving

---

## 13. Maintenance Commands

```bash
# View live logs
pm2 logs buildroonix-backend
pm2 logs buildroonix-frontend

# Restart after code update
cd /var/www/buildroonix-erp
git pull
cd backend && npm run build
pm2 restart buildroonix-backend

cd /var/www/buildroonix-erp
npm run build
pm2 restart buildroonix-frontend

# View database directly
sudo -u postgres psql buildroonix_erp
\dt    # list all tables
\q     # quit

# Run a new Prisma migration after schema change
cd backend
npx prisma migrate deploy
```

---

## 14. Quick Checklist Before Going Live

- [ ] `NODE_ENV=production` in backend `.env`
- [ ] Strong unique `JWT_SECRET` (64+ chars)
- [ ] Strong unique `ENCRYPTION_KEY` (32-byte hex)
- [ ] Strong `SUPERADMIN_PASSWORD` (12+ chars, removed from `.env` after seeding)
- [ ] PostgreSQL running and migrations applied
- [ ] PM2 showing both apps as `online`
- [ ] Nginx config tested (`nginx -t` passes)
- [ ] Domain pointing to VPS IP (check with `ping yourdomain.com`)
- [ ] SSL certificate installed (site loads on `https://`)
- [ ] UFW firewall enabled
- [ ] Uploads directory created with correct permissions
- [ ] Superadmin can login successfully
- [ ] First institution created and admin can login

---

## Summary — Port Map

| Service | Port | Exposed Publicly? |
|---------|------|-------------------|
| Frontend (Next.js) | 3000 | No — via Nginx proxy |
| Backend (Express) | 5000 | No — via Nginx proxy |
| PostgreSQL | 5432 | No — local only |
| Nginx (HTTP) | 80 | Yes |
| Nginx (HTTPS) | 443 | Yes |
