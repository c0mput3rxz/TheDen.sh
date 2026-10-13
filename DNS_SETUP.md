# DNS Setup Guide for Multi-Site Platform

## Overview

You have multiple sites sharing the same codebase:
- `c0mput3rxz.com` - Your personal site
- `sadbirdsclub.com` - E-commerce site
- Team member sites (can be subdomains or separate domains)

## DNS Configuration Options

### Option 1: Separate Domains (Recommended)

Each site has its own domain:
- `c0mput3rxz.com` → Points to your server
- `sadbirdsclub.com` → Points to your server
- `teammember.com` → Points to your server

**DNS Records:**
```
Type: A
Name: @ (or blank)
Value: YOUR_SERVER_IP
TTL: 3600

Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

### Option 2: Subdomains

Use subdomains of your main domain:
- `c0mput3rxz.com` → Main site
- `sadbirdsclub.c0mput3rxz.com` → E-commerce
- `teammember.c0mput3rxz.com` → Team member sites

**DNS Records:**
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600

Type: A
Name: sadbirdsclub
Value: YOUR_SERVER_IP
TTL: 3600

Type: A
Name: teammember
Value: YOUR_SERVER_IP
TTL: 3600
```

## Server Configuration

### Option A: Nginx Reverse Proxy (Recommended for Production)

Create `/etc/nginx/sites-available/multisite`:

```nginx
# Main site - c0mput3rxz.com
server {
    listen 80;
    server_name c0mput3rxz.com www.c0mput3rxz.com;
    
    root /path/to/c0mput3rxz_website;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /configs/ {
        # Allow config files to be loaded
        add_header Access-Control-Allow-Origin *;
    }
}

# Sad Birds Club
server {
    listen 80;
    server_name sadbirdsclub.com www.sadbirdsclub.com;
    
    root /path/to/c0mput3rxz_website;
    index sadbirdsclub.html;
    
    location / {
        try_files $uri $uri/ /sadbirdsclub.html;
    }
    
    location /configs/ {
        add_header Access-Control-Allow-Origin *;
    }
}

# Team member subdomain example
server {
    listen 80;
    server_name teammember.c0mput3rxz.com;
    
    root /path/to/c0mput3rxz_website;
    index index.html;
    
    location / {
        # Pass config parameter via query string or header
        try_files $uri $uri/ /index.html?config=teammember;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/multisite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option B: Apache Virtual Hosts

Create `/etc/apache2/sites-available/multisite.conf`:

```apache
<VirtualHost *:80>
    ServerName c0mput3rxz.com
    ServerAlias www.c0mput3rxz.com
    DocumentRoot /path/to/c0mput3rxz_website
    
    <Directory /path/to/c0mput3rxz_website>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName sadbirdsclub.com
    ServerAlias www.sadbirdsclub.com
    DocumentRoot /path/to/c0mput3rxz_website
    
    DirectoryIndex sadbirdsclub.html
    
    <Directory /path/to/c0mput3rxz_website>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Enable and restart:
```bash
sudo a2ensite multisite
sudo systemctl restart apache2
```

### Option C: Simple Node.js Server (For Development/Simple Production)

Create `server.js`:

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 80;
const ROOT = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const hostname = req.headers.host;
    
    let filePath = path.join(ROOT, parsedUrl.pathname);
    
    // Route based on hostname
    if (hostname.includes('sadbirdsclub')) {
        if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
            filePath = path.join(ROOT, 'sadbirdsclub.html');
        }
    } else if (hostname.includes('c0mput3rxz')) {
        if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
            filePath = path.join(ROOT, 'index.html');
        }
    }
    
    // Default to index.html for root
    if (parsedUrl.pathname === '/') {
        filePath = path.join(ROOT, 'index.html');
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Run with:
```bash
node server.js
```

## Cloud Hosting Options

### Netlify/Vercel (Static Hosting)

1. **Netlify:**
   - Create `netlify.toml`:
   ```toml
   [[redirects]]
     from = "https://sadbirdsclub.com/*"
     to = "/sadbirdsclub.html"
     status = 200
   
   [[redirects]]
     from = "https://c0mput3rxz.com/*"
     to = "/index.html"
     status = 200
   ```
   - Add custom domains in Netlify dashboard
   - Update DNS to point to Netlify

2. **Vercel:**
   - Create `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/", "destination": "/index.html" }
     ],
     "headers": [
       {
         "source": "/configs/(.*)",
         "headers": [
           { "key": "Access-Control-Allow-Origin", "value": "*" }
         ]
       }
     ]
   }
   ```
   - Add domains in Vercel dashboard

### GitHub Pages

1. Push code to GitHub
2. Enable GitHub Pages
3. Use custom domain in repo settings
4. For multiple domains, use separate repos or subdirectories

## Quick Setup Checklist

1. **DNS Setup:**
   - [ ] Point domain A records to your server IP
   - [ ] Add www CNAME records if needed
   - [ ] Wait for DNS propagation (can take up to 48 hours)

2. **Server Setup:**
   - [ ] Install web server (Nginx/Apache) or use Node.js
   - [ ] Configure virtual hosts/routing
   - [ ] Test with `curl -H "Host: domain.com" http://localhost`

3. **SSL/HTTPS:**
   - [ ] Install Certbot for Let's Encrypt
   - [ ] Run: `sudo certbot --nginx` or `sudo certbot --apache`
   - [ ] Auto-renewal: `sudo certbot renew --dry-run`

4. **Testing:**
   - [ ] Test each domain loads correct site
   - [ ] Verify config files load correctly
   - [ ] Check CORS headers if needed

## Testing Locally

Edit `/etc/hosts` to test locally:
```
127.0.0.1 c0mput3rxz.com
127.0.0.1 www.c0mput3rxz.com
127.0.0.1 sadbirdsclub.com
127.0.0.1 www.sadbirdsclub.com
```

Then access via browser: `http://c0mput3rxz.com:8000`

