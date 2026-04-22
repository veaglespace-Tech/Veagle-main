// Shared config with env overrides for local development.
export const config = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://veaglespace.com",
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://veaglespace.com",
  CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbehhnhhi",
};
