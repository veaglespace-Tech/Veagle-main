# Local Development Setup Guide

This project is configured to run both locally and on the Hostinger VPS. Follow these steps to set up your local environment.

## 1. Frontend (Next.js)

The frontend is located in the `client` directory.

### Environment Variables
We have created three files in `client/`:
- `.env.development`: Local development settings.
- `.env.production`: Live site settings.
- `.env.local`: **(Active)** This file overrides others. Use this to switch between Local and Live backends.

**To switch to LIVE backend from Local machine:**
Open `client/.env.local` and change:
```env
NEXT_PUBLIC_API_BASE_URL=https://veaglespace.com
```

### Running Locally
1. `cd client`
2. `npm install`
3. `npm run dev`

---

## 2. Backend (Spring Boot)

The backend is located in the `Server` directory.

### Environment Variables
We have created two files in `Server/` to help manage settings:
- `.env.development`: Local development settings (MySQL root, etc.).
- `.env.production`: Live VPS settings (Gmail SMTP, etc.).

3. You can override defaults in `Server/src/main/resources/application.yaml` by setting environment variables manually or using these files as a reference.

### Running Locally
1. Ensure you have JDK 21+ installed.
2. `cd Server`
3. `./mvnw spring-boot:run`

---

## 3. Switching Environments

| Environment | Frontend URL | Backend API URL |
| :--- | :--- | :--- |
| **Local** | `http://localhost:3000` | `http://localhost:8080` |
| **Production** | `https://veaglespace.com` | `https://veaglespace.com` |

> [!TIP]
> Always keep `.env.local` for your personal local machine settings. Do not commit `.env.local` to git if you change it to production values.
