#!/usr/bin/env node
/**
 * Simple HTTP server for multi-site platform
 * Routes requests based on hostname to appropriate HTML files
 * 
 * Usage: node server.js [port]
 * Default port: 8000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] || 8000;
const ROOT = __dirname;

// Map hostnames to HTML files
const hostnameMap = {
    'sadbirdsclub.com': 'sadbirdsclub.html',
    'www.sadbirdsclub.com': 'sadbirdsclub.html',
    'sadbirdsclub.c0mput3rxz.com': 'sadbirdsclub.html',
    'c0mput3rxz.com': 'index.html',
    'www.c0mput3rxz.com': 'index.html',
    'localhost': 'index.html',
    '127.0.0.1': 'index.html'
};

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code, 'utf-8');
            }
        } else {
            const contentType = getMimeType(filePath);
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const hostname = req.headers.host?.split(':')[0] || 'localhost';
    let filePath = path.join(ROOT, parsedUrl.pathname);
    
    // Handle root path - route based on hostname
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
        const defaultFile = hostnameMap[hostname] || hostnameMap[hostname.toLowerCase()] || 'index.html';
        filePath = path.join(ROOT, defaultFile);
    }
    
    // Security: prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Try as directory with index.html
            if (parsedUrl.pathname.endsWith('/')) {
                const indexPath = path.join(filePath, 'index.html');
                serveFile(indexPath, res);
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        } else {
            serveFile(filePath, res);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Multi-site server running on port ${PORT}`);
    console.log(`📁 Serving from: ${ROOT}`);
    console.log(`\n🌐 Available sites:`);
    console.log(`   - http://localhost:${PORT} (c0mput3rxz.com)`);
    console.log(`   - http://localhost:${PORT}/sadbirdsclub.html (sadbirdsclub.com)`);
    console.log(`\n💡 To test with custom domains, add to /etc/hosts:`);
    console.log(`   127.0.0.1 c0mput3rxz.com`);
    console.log(`   127.0.0.1 sadbirdsclub.com`);
    console.log(`\n   Then visit: http://c0mput3rxz.com:${PORT}`);
});

