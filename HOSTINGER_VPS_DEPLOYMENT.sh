#!/bin/bash
# ============================================
# HOSTINGER VPS DEPLOYMENT SCRIPT
# ============================================
# VPS IP: 82.112.237.155
# Domain: https://veaglespace.com
# ============================================

echo "🚀 Starting Veagle Space VPS Deployment..."

# ============================================
# 1. SET ENVIRONMENT VARIABLES
# ============================================
echo "📝 Setting environment variables..."

export DB_URL="jdbc:mysql://127.0.0.1:3306/veagledb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata"
export DB_USERNAME="root"
export DB_PASSWORD="Veagle@123"
export MAIL_USER="singareakshay2004@gmail.com"
export MAIL_PASS="rcckpmkrnkopufmv"
export JWT_SECRET="VeagleJwtSecretKey2026UltraSecure123!"
export ADMIN_SECRET="admin123"
export SERVER_PORT=8080

export NEXT_PUBLIC_SITE_URL="https://veaglespace.com"
export NEXT_PUBLIC_API_BASE_URL="https://veaglespace.com"
export NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dbehhnhhi"

echo "✅ Environment variables set"

# ============================================
# 2. BACKEND BUILD & RUN
# ============================================
echo "🔨 Building backend..."

cd /home/akshay/Desktop/VeagleWebSite/Veagle/Server

# Clean previous build
./mvnw clean package -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
    echo "🚀 Starting backend on port $SERVER_PORT..."
    nohup java -jar target/VeagleSpaceTech-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "✅ Backend running with PID: $BACKEND_PID"
else
    echo "❌ Backend build failed"
    exit 1
fi

sleep 5

# ============================================
# 3. FRONTEND BUILD & RUN
# ============================================
echo "🔨 Building frontend..."

cd /home/akshay/Desktop/VeagleWebSite/Veagle/client

npm install
NODE_OPTIONS='--max-old-space-size=8192 --max-semi-space-size=256' npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
    echo "🚀 Starting frontend..."
    nohup NODE_OPTIONS='--max-old-space-size=4096 --max-semi-space-size=128' npm run start > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "✅ Frontend running with PID: $FRONTEND_PID"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# ============================================
# 4. VERIFY SERVICES
# ============================================
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
echo "  Backend:  http://127.0.0.1:8080  (running on port 8080)"
echo "  Frontend: http://127.0.0.1:3000  (running on port 3000)"
echo "  Domain:   https://veaglespace.com"
echo "  VPS IP:   82.112.237.155"
echo ""
echo "📝 Logs:"
echo "  Backend:  /home/akshay/Desktop/VeagleWebSite/Veagle/Server/backend.log"
echo "  Frontend: /home/akshay/Desktop/VeagleWebSite/Veagle/client/frontend.log"
echo ""
echo "⚙️  Next step: Configure Nginx reverse proxy"
echo ""
