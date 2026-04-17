# 🚀 HOSTINGER VPS DEPLOYMENT GUIDE
## Veagle Space - Complete Setup

**VPS Details:**
- IP: 82.112.237.155
- Domain: https://veaglespace.com
- OS: Linux (Ubuntu/CentOS recommended)

---

## ✅ CHECKLIST

- [x] MySQL credentials: root / Veagle@123
- [x] Email: singareakshay2004@gmail.com / rcckpmkrnkopufmv
- [x] JWT Secret: VeagleJwtSecretKey2026UltraSecure123!
- [x] Backend: Spring Boot 4.0.4, Java 21
- [x] Frontend: Next.js 16, Node 20+
- [x] Domain: veaglespace.com

---

## 🛠️ STEP 1: VPS SETUP (Prerequisites)

### SSH into Hostinger VPS
```bash
ssh root@82.112.237.155
```

### Update System
```bash
apt update && apt upgrade -y
```

### Install Java 21
```bash
apt install -y openjdk-21-jdk-headless
java -version
```

### Install Node.js 20+
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm
node -v
npm -v
```

### Install MySQL Server
```bash
apt install -y mysql-server

# Start MySQL
systemctl start mysql
systemctl enable mysql

# Secure MySQL installation
mysql_secure_installation
# Or run:
mysql -u root -p
# Then set root password if needed
```

### Install Nginx
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### Install Git
```bash
apt install -y git
```

---

## 📁 STEP 2: Deploy Project Code

### Clone or Upload Project
```bash
cd /home
git clone <your-repo-url> veagle-app
cd veagle-app
```

Or if you have a ZIP file:
```bash
cd /home
unzip veagle-app.zip
cd veagle-app
```

### Create MySQL Database
```bash
mysql -u root -p
# Enter password: Veagle@123

CREATE DATABASE IF NOT EXISTS veagledb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'Veagle@123';
GRANT ALL PRIVILEGES ON veagledb.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Create uploads directory
```bash
mkdir -p /home/veagle-app/Server/uploads
chmod -R 755 /home/veagle-app/Server/uploads
```

---

## 🔧 STEP 3: BUILD & RUN BACKEND

### Navigate to backend
```bash
cd /home/veagle-app/Server
```

### Set environment variables
```bash
export DB_URL="jdbc:mysql://127.0.0.1:3306/veagledb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata"
export DB_USERNAME="root"
export DB_PASSWORD="Veagle@123"
export MAIL_USER="singareakshay2004@gmail.com"
export MAIL_PASS="rcckpmkrnkopufmv"
export JWT_SECRET="VeagleJwtSecretKey2026UltraSecure123!"
export ADMIN_SECRET="admin123"
export SERVER_PORT=8080
```

### Build backend
```bash
./mvnw clean package -DskipTests
```

### Run backend (in background)
```bash
nohup java -jar target/VeagleSpaceTech-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
```

### Verify backend is running
```bash
curl http://127.0.0.1:8080/api/v1/categories
# Should get JSON response
```

---

## 🎨 STEP 4: BUILD & RUN FRONTEND

### Navigate to frontend
```bash
cd /home/veagle-app/client
```

### Set frontend environment variables
```bash
export NEXT_PUBLIC_SITE_URL="https://veaglespace.com"
export NEXT_PUBLIC_API_BASE_URL="https://veaglespace.com"
export NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dbehhnhhi"
```

### Install dependencies
```bash
npm install
```

### Build frontend
```bash
NODE_OPTIONS='--max-old-space-size=8192 --max-semi-space-size=256' npm run build
```

### Run frontend (in background)
```bash
nohup NODE_OPTIONS='--max-old-space-size=4096 --max-semi-space-size=128' npm run start > frontend.log 2>&1 &
```

### Verify frontend is running
```bash
curl http://127.0.0.1:3000
# Should get HTML response
```

---

## 🌐 STEP 5: CONFIGURE NGINX REVERSE PROXY

### Copy Nginx config
```bash
cp /home/veagle-app/nginx-veaglespace.conf /etc/nginx/sites-available/veaglespace
```

### Enable the site
```bash
ln -s /etc/nginx/sites-available/veaglespace /etc/nginx/sites-enabled/veaglespace
```

### Disable default site (optional)
```bash
rm /etc/nginx/sites-enabled/default
```

### Test Nginx config
```bash
nginx -t
```

### Reload Nginx
```bash
systemctl reload nginx
```

---

## 🔒 STEP 6: SETUP SSL CERTIFICATE (Let's Encrypt)

### Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### Generate SSL certificate
```bash
certbot certonly --nginx -d veaglespace.com -d www.veaglespace.com
```

### Auto-renewal (already enabled)
```bash
systemctl enable certbot.timer
systemctl start certbot.timer
```

---

## 🚀 STEP 7: CREATE SYSTEMD SERVICES (Auto-start on reboot)

### Backend Service
Create `/etc/systemd/system/veagle-backend.service`:
```ini
[Unit]
Description=Veagle Space Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/veagle-app/Server
Environment="DB_URL=jdbc:mysql://127.0.0.1:3306/veagledb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata"
Environment="DB_USERNAME=root"
Environment="DB_PASSWORD=Veagle@123"
Environment="MAIL_USER=singareakshay2004@gmail.com"
Environment="MAIL_PASS=rcckpmkrnkopufmv"
Environment="JWT_SECRET=VeagleJwtSecretKey2026UltraSecure123!"
Environment="ADMIN_SECRET=admin123"
Environment="SERVER_PORT=8080"
ExecStart=/usr/bin/java -jar target/VeagleSpaceTech-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable it:
```bash
systemctl daemon-reload
systemctl enable veagle-backend
systemctl start veagle-backend
```

### Frontend Service
Create `/etc/systemd/system/veagle-frontend.service`:
```ini
[Unit]
Description=Veagle Space Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/veagle-app/client
Environment="NEXT_PUBLIC_SITE_URL=https://veaglespace.com"
Environment="NEXT_PUBLIC_API_BASE_URL=https://veaglespace.com"
Environment="NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbehhnhhi"
Environment="NODE_OPTIONS=--max-old-space-size=4096 --max-semi-space-size=128"
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable it:
```bash
systemctl daemon-reload
systemctl enable veagle-frontend
systemctl start veagle-frontend
```

---

## ✅ VERIFY DEPLOYMENT

### Check services status
```bash
systemctl status veagle-backend
systemctl status veagle-frontend
systemctl status nginx
```

### Check logs
```bash
# Backend logs
journalctl -u veagle-backend -f

# Frontend logs
journalctl -u veagle-frontend -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Test endpoints
```bash
curl https://veaglespace.com
curl https://veaglespace.com/api/v1/categories
```

---

## 🐛 TROUBLESHOOTING

### Backend not starting?
```bash
# Check logs
cat /var/log/syslog | grep veagle-backend

# Check if port 8080 is in use
netstat -tulpn | grep 8080

# Kill and restart
pkill -f "java -jar"
systemctl restart veagle-backend
```

### Frontend not building?
```bash
# Clear cache
rm -rf /home/veagle-app/client/.next

# Rebuild with more memory
NODE_OPTIONS='--max-old-space-size=16384' npm run build
```

### Nginx issues?
```bash
# Test config
nginx -t

# Check if listening
netstat -tulpn | grep 443
```

### Database connection failed?
```bash
# Verify MySQL is running
systemctl status mysql

# Test connection
mysql -h 127.0.0.1 -u root -p -e "USE veagledb; SHOW TABLES;"
```

---

## 📊 MONITORING

### Check disk space
```bash
df -h
```

### Check memory usage
```bash
free -m
```

### Check running processes
```bash
ps aux | grep java
ps aux | grep node
ps aux | grep nginx
```

---

## 🔄 AUTOMATIC DEPLOYMENT SCRIPT

Run this to deploy everything at once:
```bash
bash /home/veagle-app/HOSTINGER_VPS_DEPLOYMENT.sh
```

---

## 📞 SUPPORT

- Backend: http://127.0.0.1:8080
- Frontend: http://127.0.0.1:3000
- Domain: https://veaglespace.com
- API: https://veaglespace.com/api/v1

---

**Setup Date:** April 17, 2026
**Last Updated:** April 17, 2026
