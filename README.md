# DIR. SMILIE — Backend API

Backend API for the DIR. SMILIE filmmaker portfolio website.

## Tech Stack

- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for media uploads
- Nodemailer for email notifications

## Features

- Admin authentication
- CRUD operations for Works, Awards, Contacts
- Media upload to Cloudinary
- Contact form with email notifications

## Environment Variables

Create a `.env` file with:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
ADMIN_EMAIL=admin@dirsmilie.com
ADMIN_PASSWORD=your_admin_password
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password