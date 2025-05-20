# React + Vite
Here’s a clean and professional `README.md` content that you can copy-paste into your GitHub repo:

---

# 🩺 Patient Registration App

This is a **frontend-only** Patient Registration web application built with **React**, **Tailwind CSS**, and **PGlite (SQLite-compatible in-memory DB)**. It allows users to register patients and run SQL queries directly from the browser — without any backend server.

## 🚀 Features

* 📋 Patient Registration Form with the following fields:

  * Name
  * Age
  * Gender (Dropdown)
  * Phone Number (with country code & flag)
  * Address
  * Blood Group (Dropdown)
  * Emergency Contact (with country code & flag)
* 🧠 Real-time local database using `@electric-sql/pglite`
* 🛠 SQL Query Runner to fetch and display patient data
* 🎨 Responsive UI styled with **Tailwind CSS** (blue & white theme)
* 📱 Fully integrated country code selector using `react-phone-input-2`

## 🧑‍💻 Tech Stack

* **React** (via Vite)
* **Tailwind CSS**
* **@electric-sql/pglite** (for local SQLite-compatible storage)
* **react-phone-input-2** (for country code dropdown)
* **flag-icon-css** (for country flags)

## 📦 Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/SodamShreya/patient-registration-app.git
   cd patient-registration-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:5173](http://localhost:5173)

> Note: All patient data is stored in memory only and will reset on refresh. No backend is used.

## 📁 File Structure Overview

```
├── src/
│   ├── App.jsx          # Main component
│   ├── phoneInputFix.css # Custom phone input styles
├── public/
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── .gitignore
```

## 🌐 Live Demo

Deployed Link: [https://patient-registration-app-orpin.vercel.app](https://patient-registration-app-orpin.vercel.app)

