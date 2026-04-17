# ⚡ QUICK REFERENCE - HOSTINGER VPS

## 🔐 CREDENTIALS

| Service | Username | Password | Host |
|---------|----------|----------|------|
| MySQL | root | Veagle@123 | 127.0.0.1:3306 |
| Email | singareakshay2004@gmail.com | rcckpmkrnkopufmv | smtp.gmail.com:587 |
| JWT Secret | - | VeagleJwtSecretKey2026UltraSecure123! | - |
| Admin Secret | - | admin123 | - |

---

## 🌐 SERVICES

| Service | Port | URL | Status Command |
|---------|------|-----|-----------------|
| Backend | 8080 | http://127.0.0.1:8080 | systemctl status veagle-backend |
| Frontend | 3000 | http://127.0.0.1:3000 | systemctl status veagle-frontend |
| Nginx | 443/80 | https://veaglespace.com | systemctl status nginx |
| MySQL | 3306 | 127.0.0.1 | systemctl status mysql |

---

## 🚀 QUICK COMMANDS

### SSH into VPS
```bash
ssh root@82.112.237.155
```

### Start All Services
```bash
systemctl start veagle-backend
systemctl start veagle-frontend
systemctl start nginx
```

### Stop All Services
```bash
systemctl stop veagle-backend
systemctl stop veagle-frontend
systemctl stop nginx
```

### Restart Services
```bash
systemctl restart veagle-backend
systemctl restart veagle-frontend
systemctl restart nginx
```

### View Logs (Real-time)
```bash
# Backend
journalctl -u veagle-backend -f

# Frontend
journalctl -u veagle-frontend -f

# Nginx
tail -f /var/log/nginx/access.log
```

### Kill Process by Port
```bash
# Kill service on port 8080
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill service on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Rebuild & Deploy Backend
```bash
cd /home/veagle-app/Server
./mvnw clean package -DskipTests
systemctl restart veagle-backend
```

### Rebuild & Deploy Frontend
```bash
cd /home/veagle-app/client
npm install
npm run build
systemctl restart veagle-frontend
```

---

## 🔗 USEFUL ENDPOINTS

### API Endpoints
```
GET  https://veaglespace.com/api/v1/categories
GET  https://veaglespace.com/api/v1/services
GET  https://veaglespace.com/api/v1/products
GET  https://veaglespace.com/api/v1/clients
GET  https://veaglespace.com/api/v1/jobs
GET  https://veaglespace.com/api/v1/portfolio
POST https://veaglespace.com/api/v1/contacts
POST https://veaglespace.com/api/v1/auth/login
POST https://veaglespace.com/api/v1/auth/register
```

### File Upload
```
GET https://veaglespace.com/uploads/products/filename.jpg
GET https://veaglespace.com/uploads/services/filename.jpg
GET https://veaglespace.com/uploads/resumes/filename.pdf
```

---

## 📊 MONITORING

### CPU & Memory Usage
```bash
top
# or
htop
```

### Disk Space
```bash
df -h
du -sh /home/veagle-app
```

### Network Connections
```bash
netstat -tulpn
# or
ss -tulpn
```

### Active Processes
```bash
ps aux | grep java
ps aux | grep node
ps aux | grep nginx
```

---

## 🛠️ DATABASE BACKUP

### Backup Database
```bash
mysqldump -u root -p veagledb > /home/veagle-app/backup-veagledb-$(date +%Y%m%d-%H%M%S).sql
```

### Restore Database
```bash
mysql -u root -p veagledb < /path/to/backup.sql
```

---

## 🔒 SSL/CERTIFICATE

### Check SSL Certificate Status
```bash
certbot certificates
```

### Renew SSL Certificate
```bash
certbot renew --dry-run
```

### Force Renew
```bash
certbot renew --force-renewal
```

---

## 🐛 COMMON ISSUES

### "Connection refused" on port 8080?
```bash
systemctl status veagle-backend
journalctl -u veagle-backend -f
```

### Frontend not loading images?
```bash
# Check backend is running
curl http://127.0.0.1:8080/uploads/products/
# Check Nginx proxy settings
cat /etc/nginx/sites-available/veaglespace
```

### Database "access denied"?
```bash
mysql -u root -p -e "GRANT ALL ON veagledb.* TO 'root'@'localhost'; FLUSH PRIVILEGES;"
```

### Out of memory?
```bash
# Increase Node memory for frontend build
export NODE_OPTIONS='--max-old-space-size=16384'
npm run build
```

---

## 📁 IMPORTANT DIRECTORIES

```
/home/veagle-app/              → Project root
/home/veagle-app/Server/       → Backend (Spring Boot)
/home/veagle-app/client/       → Frontend (Next.js)
/home/veagle-app/Server/uploads/  → File storage
/etc/nginx/sites-available/veaglespace  → Nginx config
/etc/letsencrypt/live/veaglespace.com/  → SSL certificates
```

---

## 📞 VPS INFO

**IP Address:** 82.112.237.155
**Domain:** veaglespace.com
**Subdomain:** www.veaglespace.com

---

**Created:** April 17, 2026
**For Hosting:** Hostinger
