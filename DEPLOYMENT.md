# Deployment Guide: Self-Hosted NestJS & PostgreSQL on Ubuntu + Next.js on Vercel

This guide provides a comprehensive, production-grade walkthrough for deploying the **ETHShala** backend (NestJS) and database (PostgreSQL) onto a self-hosted Ubuntu Server, setting up an Nginx reverse proxy with SSL, and connecting it to a Next.js frontend hosted on Vercel.

---

## Architecture Overview

```mermaid
graph TD
    Vercel[Vercel Frontend: Next.js] <-->|HTTPS / API Requests| Nginx[Nginx Reverse Proxy: ethshalaapi.eipsinsight.com]
    Nginx <-->|Local Proxy: Port 4000| NestJS[NestJS Backend: PM2 Process]
    NestJS <-->|Localhost Query| Postgres[(PostgreSQL Database)]
    Vercel <-->|Direct Server Actions| Postgres
```

---

## Step 1: Ubuntu Server Initial Configuration

### 1. SSH into your Ubuntu Server
```bash
ssh user@your_server_ip
```

### 2. Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Configure the Firewall (UFW)
Secure your server by only allowing SSH, HTTP, and HTTPS traffic:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Step 2: Install & Configure PostgreSQL

### 1. Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
```

### 2. Create the Production Database and User
Switch to the default `postgres` system user and open the Postgres CLI:
```bash
sudo -i -u postgres psql
```
Run the following SQL commands to set up your database, user, and password:
```sql
CREATE DATABASE ethshala;
CREATE USER shala_admin WITH PASSWORD 'choose_a_strong_password';
GRANT ALL PRIVILEGES ON DATABASE ethshala TO shala_admin;
ALTER DATABASE ethshala OWNER TO shala_admin;
\q
```

> [!IMPORTANT]
> Since Next.js on Vercel uses Server Actions that query the database directly, your database must be accessible externally. Follow the steps below to securely expose PostgreSQL.

### 3. Enable Remote Database Connections (Securely)
Edit the PostgreSQL configuration file (replace `16` with your installed Postgres version):
```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```
Find the `listen_addresses` line, uncomment it, and change it to listen to all interfaces:
```ini
listen_addresses = '*'
```

Next, configure client authentication:
```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```
Add the following line at the end of the file to allow remote password connections securely. Replace `0.0.0.0/0` with Vercel's IP ranges if you want to restrict it, or keep it open if you rely on strong passwords:
```text
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    ethshala        shala_admin     0.0.0.0/0               scram-sha-256
```

### 4. Restart PostgreSQL and Allow Port in Firewall
```bash
sudo systemctl restart postgresql
sudo ufw allow 5432/tcp
```

---

## Step 3: Node.js and Monorepo Environment Setup

### 1. Install Node.js (LTS Version 20 or 22)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Install pnpm Globally
```bash
sudo npm install -g pnpm
```

### 3. Clone and Set Up the Monorepo
Clone your repository into `/var/www/ethshala`:
```bash
sudo mkdir -p /var/www/ethshala
sudo chown -R $USER:$USER /var/www/ethshala
git clone https://github.com/your-org/eips-bootcamp.git /var/www/ethshala
cd /var/www/ethshala
pnpm install
```

---

## Step 4: Run NestJS Backend with PM2

### 1. Create the Environment File for the API
Create a `.env` file in `/var/www/ethshala/apps/api/.env`:
```bash
nano apps/api/.env
```
Add the following configuration:
```env
PORT=4000
DATABASE_URL="postgresql://shala_admin:choose_a_strong_password@localhost:5432/ethshala?schema=public"
INTERNAL_API_KEY="generate_a_long_secure_random_key"
CORS_ORIGIN="https://ethshala.vercel.app" # Replace with your Vercel URL
```

### 2. Generate Prisma Client and Run Migrations
```bash
pnpm --filter api build
```
This command will trigger Prisma generation and NestJS compilation. Next, apply the schema to your newly created database:
```bash
npx prisma db push --schema=prisma/schema.prisma
```

### 3. Manage NestJS Process using PM2
Install PM2 globally to manage the NestJS process:
```bash
sudo npm install -g pm2
```
Start the production server:
```bash
pm2 start dist/main.js --name "ethshala-api" --cwd "/var/www/ethshala/apps/api"
```
Configure PM2 to automatically restart the backend process on system reboot:
```bash
pm2 startup
# Copy and run the command printed by PM2 in your terminal
pm2 save
```

---

## Step 5: Configure Nginx Reverse Proxy & SSL

### 1. Install Nginx
```bash
sudo apt install nginx -y
```

### 2. Create the Server Block Configuration
Create an Nginx configuration file for your subdomain:
```bash
sudo nano /etc/nginx/sites-available/ethshalaapi.eipsinsight.com
```
Add the following configuration. This configures Nginx to listen on port 80 and reverse-proxy requests to the NestJS app running locally on port 4000:
```nginx
server {
    listen 80;
    server_name ethshalaapi.eipsinsight.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable the Site and Test Nginx
Link the site configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/ethshalaapi.eipsinsight.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Setup SSL with Let's Encrypt Certbot
Install Certbot and obtain your SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ethshalaapi.eipsinsight.com
```
Certbot will automatically verify your domain, obtain the certificate, and rewrite your Nginx configuration to support secure HTTPS with HTTP-to-HTTPS redirects.

---

## Step 6: Connect Vercel Frontend to Self-Hosted API

Now that your self-hosted backend and database are live:

1. Connect your repository to **Vercel** and select `apps/web` as the **Root Directory**.
2. Configure the following **Environment Variables** in Vercel settings:

| Environment Variable | Production Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://ethshalaapi.eipsinsight.com` | URL of your self-hosted NestJS backend |
| `INTERNAL_API_KEY` | `generate_a_long_secure_random_key` | Must match the key set in the NestJS `.env` |
| `BETTER_AUTH_SECRET` | `generate_a_strong_session_secret` | Secret key used for authenticating sessions |
| `BETTER_AUTH_URL` | `https://eipsinsight.com` | Your production frontend URL |
| `DATABASE_URL` | `postgresql://shala_admin:choose_a_strong_password@your_server_ip:5432/ethshala?schema=public` | PostgreSQL connection string pointing to your self-hosted DB |

---

## 🛠️ Post-Deployment Health Verification

After completing the steps, verify the connections:
1. **Check Nginx Status:** `systemctl status nginx`
2. **Check NestJS Status:** `pm2 status`
3. **Verify API Logs:** `pm2 logs ethshala-api`
4. **Test CORS Connection:** Open your browser console on the Vercel site and check if network requests to `https://ethshalaapi.eipsinsight.com/referrals/leaderboard/all` return successfully without CORS blocks.
