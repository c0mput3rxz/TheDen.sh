# Quick Start Guide

## Running Locally

### Option 1: Python HTTP Server (Simple)
```bash
cd /Users/png/git/c0mput3rxz_website
python3 -m http.server 8000
```

Then visit:
- http://localhost:8000 (your site)
- http://localhost:8000/sadbirdsclub.html (Sad Birds Club)

### Option 2: Node.js Server (Smart Routing)
```bash
cd /Users/png/git/c0mput3rxz_website
node server.js 8000
```

The Node.js server automatically routes based on hostname.

## Testing with Custom Domains Locally

1. Edit `/etc/hosts` (requires sudo):
```bash
sudo nano /etc/hosts
```

2. Add these lines:
```
127.0.0.1 c0mput3rxz.com
127.0.0.1 www.c0mput3rxz.com
127.0.0.1 sadbirdsclub.com
127.0.0.1 www.sadbirdsclub.com
```

3. Start server: `node server.js 8000`

4. Visit:
- http://c0mput3rxz.com:8000
- http://sadbirdsclub.com:8000

## DNS Setup for Production

### Step 1: Get Your Server IP
```bash
curl ifconfig.me
```

### Step 2: Configure DNS at Your Domain Registrar

For each domain, add these DNS records:

**Type A Record:**
- Name: `@` (or blank/root)
- Value: `YOUR_SERVER_IP`
- TTL: `3600`

**Type A Record (for www):**
- Name: `www`
- Value: `YOUR_SERVER_IP`
- TTL: `3600`

### Step 3: Configure Web Server

See `DNS_SETUP.md` for detailed Nginx/Apache configuration.

### Step 4: Wait for DNS Propagation

DNS changes can take 5 minutes to 48 hours. Check with:
```bash
dig c0mput3rxz.com
dig sadbirdsclub.com
```

## Adding a New Team Member Site

1. Create config file:
```bash
cp configs/team_member_template.json configs/teammember.json
```

2. Edit `configs/teammember.json` with their info

3. Access via:
   - URL parameter: `http://yoursite.com?config=teammember`
   - Or set up subdomain: `teammember.yoursite.com`

4. Update `server.js` hostnameMap if using subdomain

## SSL/HTTPS Setup

After DNS is working, get free SSL certificates:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d c0mput3rxz.com -d www.c0mput3rxz.com
sudo certbot --nginx -d sadbirdsclub.com -d www.sadbirdsclub.com

# Auto-renewal (already set up by certbot)
```

## Common Issues

**Config not loading?**
- Check browser console for CORS errors
- Verify `configs/` directory is accessible
- Check file permissions: `chmod 644 configs/*.json`

**Wrong site showing?**
- Check hostname in browser address bar
- Verify DNS is pointing to correct server
- Clear browser cache

**Port already in use?**
```bash
# Find what's using port 8000
lsof -ti:8000

# Kill it
kill -9 $(lsof -ti:8000)

# Or use different port
node server.js 8080
```

