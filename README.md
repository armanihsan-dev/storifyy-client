## Modern Distributed Cloud Storage : Storifyy

Storifyy is a full-stack cloud storage platform designed for secure file management and seamless sharing.
It features a subscription-based storage system with Lemon squeezy integration, allowing users to upgrade plans effortlessly.

Built with React, Vite, and Tailwind CSS on the client, and Node.js, Express, MongoDB, and Redis on the backend, Storifyy leverages AWS S3 for scalable storage and supports Google Drive imports for smooth file migration.

---

## 🚀 Quick Overview

- **Purpose:** Store, share, and manage digital assets with enterprise-grade features and a delightful UX.
- **Highlights:** Secure auth (OTP & OAuth), background jobs, Google Drive imports, and subscription billing.

---

# Features

## Authentication and Security

- User registration and login with email and password
- OAuth login with **Google** and **GitHub**
- OTP-based verification for secure account setup
- Passwords stored in hashed format using **bcrypt**
- Tokens stored in **signed cookies**
- Security hardening with **CORS**, **Helmet**, and input sanitization
- **Rate limiting** and **throttling** to prevent abuse

---

## File Management

- Upload any file type (PDFs, images, videos, documents, etc.) with progress tracking
- Scalable cloud storage using **AWS S3**
- **Grid** and **List** views for file navigation
- View file details (size, type, created date, modified date)
- Search and filter files easily
- Rename, delete (soft & hard delete), and recover files
- Storage usage tracking with cloud-based quota management

---

## Cloud Storage and Import

- **AWS S3** integration for secure file storage
- **CloudFront CDN** for fast file delivery and optimized performance
- **Google Drive Import** for seamless file transfers
- Batch import support for multiple files
- Progress tracking for import operations
- Automatic file type detection and metadata preservation

---

## Sharing and Permissions

- Share files via email (registered users only) or direct links (guest users)
- Role-based access control (**Viewer / Editor**)
- Dashboard for managing **Shared by Me** and **Shared with Me** files
- View recent sharing activity logs
- Real-time permission updates

---

## Settings and Customization

- Update profile information (name, email, profile picture)
- View statistics of used and available storage
- Change password
- Manage connected devices and active sessions
- Account options: logout, disable, or delete account

---

## Admin Dashboard

- User overview: total, active, online, and deleted users
- User management: view, filter, edit roles, force logout, and delete users
- Deletion system:
  - **Soft Delete** (recoverable)
  - **Hard Delete** (permanent, with confirmation)
- Role and permission management:
  - User, Manager, Admin, SuperAdmin (with badges)
- File management with directory and file navigation
- Real-time tracking of online users with instant refresh

---

## Subscriptions and Billing

- Subscription plans with **monthly** and **yearly** options
- Secure payments via **Lemon squeezy Checkout**
- Automatic plan activation with instant usage limit updates
- Webhook-based payment verification
- Auto-renewal support for recurring subscriptions
- Manage active plans: upgrade, downgrade, or cancel
- Billing history with downloadable invoice links
- Access control based on plan limits:
  - Storage quota
  - File upload size
  - Advanced features

---

## 🏗️ Architecture & Tech Stack

- **Client (Frontend):** React + Vite + TailwindCSS
- **Server (Backend):** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Cache / Queue:** Redis
- **Storage:** AWS S3 (+ CloudFront CDN)
- **Auth / External APIs:** Google OAuth2, Google Drive API
- **Payment:** Lemon Squeezy (Subscriptions & Webhooks)

---

## 📁 Project Structure (high-level)

- `client/` – React app (components, pages, hooks)
- `server/` – Express routes, controllers, services, models
- `services/` – S3 helpers, payment & webhook handlers, background jobs
- `scripts/` – Dev and deployment utilities

> Tip: Look for `app.js` to find the server entry point.

---

## 🖼️ Screenshots

![](./github/images/login.png)
![](./github/images/register.png)
![](./github/images/otp.png)

## Home

![](./github/images/home.png)
![](./github/images/home2.png)
![](./github/images/home3.png)
![](./github/images/home4.png)

## Profile

![](./github/images/profile1.png)
![](./github/images/profile2.png)
![](./github/images/profile3.png)
![](./github/images/profile4.png)
![](./github/images/profile5.png)
![](./github/images/profile6.png)
![](./github/images/profile7.png)
![](./github/images/profile9.png)
![](./github/images/profile8.png)

## Share

![](./github/images/share1.png)
![](./github/images/share2.png)
![](./github/images/share3.png)
![](./github/images/share4.png)
![](./github/images/share5.png)
![](./github/images/share6.png)

## Admin Dashboard

![](./github/images/admin1.png)
![](./github/images/admin2.png)
![](./github/images/admin3.png)
![](./github/images/admin4.png)

## Import from google drive

![](./github/images/gdrive1.png)

## Plans & Subscription management

![](./github/images/plan1.png)
![](./github/images/plan2.png)
![](./github/images/plan3.png)
![](./github/images/plan4.png)
![](./github/images/plan11.png)
![](./github/images/plan5.png)
![](./github/images/plan6.png)
![](./github/images/plan7.png)
![](./github/images/plan8.png)
![](./github/images/plan9.png)
![](./github/images/plan10.png)

---

## 🛠️ Getting Started

Follow these steps to set up **storifyy** locally on your machine.

---

### ✅ Prerequisites

Make sure you have the following installed and configured:

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB**
- **Redis**
- **AWS credentials** (for S3 file storage)

---

### 📦 Clone the Repository

```bash
git clone https://github.com/armanihsan-dev/storifyy-client.git
cd client
```

### 🔐 Environment Setup

#### Client (.env)

Create a `.env` file in the `client/` directory and add the following:

```env
VITE_GOOGLE_OAUTH_CLIENT_ID=your-google-oauth-client-id
VITE_GOOGLE_PICKER_API_KEY=your-google-picker-api-key
GOOGLE_APP_ID=your-google-app-id
```

Make sure your Google OAuth and Picker APIs are properly configured in the Google Cloud Console.

### ▶️ Run the Application

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application should now be running locally.

🔎 You can review `app.js` to understand the server configuration and required environment variables.

---

### ⚙️ Additional Setup Requirements

#### AWS Configuration

- Set up an **S3 bucket** with the necessary permissions to securely store files.
- Configure **CloudFront** to enable fast, global content delivery and optional signed URL support.
- Assign proper **IAM roles or users** with access to S3 and CloudFront services.
- Generate and securely store any required **private keys** for signed URLs or signed cookies.

#### Google Drive API Setup

- Create a new project in the **Google Cloud Console** and enable the **Google Drive API**.
- Generate **OAuth 2.0 credentials** (Client ID and Client Secret) for both web and server usage.
- Configure the **OAuth consent screen** and define the required scopes for Drive access.
- Optionally, create an **API key** if it is needed for your implementation.
