# Local SMTP Server for Development & Testing (Node.js)

A lightweight **local SMTP server** built with **Node.js** for development and testing.
Instead of sending real emails, this application captures emails and stores them as files locally.

The application can run:
- As a normal Node.js application
- As a **Windows Service** for continuous background execution

---

## ✅ Features

- Reads configuration from `.env`
- Local SMTP server for testing
- Captures all outgoing emails
- Stores each email as a file
- Email file includes:
  - From
  - To
  - CC
  - Subject
  - Body
- HTTP health check endpoint (`/`)
- Supports Windows Service (install, start, stop, restart, uninstall)

---

## 🧩 Technology Stack

- Node.js
- smtp-server
- mailparser
- Express.js
- dotenv
- uuid
- node-windows

---

## 📁 Project Structure (Everything in Root Directory)

```
smtp-local-server/
├── server.js           # SMTP + HTTP server
├── index.js            # Application entry point
├── serviceManager.js   # Windows Service manager
├── .env                # Environment configuration
├── package.json
├── emails/             # Captured email files
└── README.md
```

---

## ✅ Prerequisites

### Install Node.js

Download and install **Node.js (LTS recommended)**:

https://nodejs.org/

Verify installation:

```
node -v
npm -v
```

---

## 📦 Install Dependencies

From the project root directory:

```
npm install
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```
SMTP_PORT=2525
HTTP_PORT=3000
EMAIL_SAVE_PATH=./emails
SERVICE_NAME=LocalSMTP
```

---

## 🚀 Running as Normal Node.js Application

```
node index.js
```

- SMTP server starts on configured port
- HTTP server starts on configured port
- Process runs until stopped

---

## 🌐 HTTP Health Check

Endpoint:

```
GET /
```

Response:

```
its works
```

---

## 📬 SMTP Configuration (For Applications)

```
Host: localhost
Port: 2525
Username: not required
Password: not required
TLS: false
```

All emails are captured locally and not sent externally.

---

## 🗃️ Email File Format

Each email is stored as a `.txt` file inside the `emails` folder.

Example:

```
From   : test@example.com
To     : dev@local.com
CC     : cc@local.com
Subject: Test Email
Date   : 2026-04-13T16:32:00.000Z

---- BODY ----
This is the email body content.
```

---

## 🪟 Windows Service Support

This project supports running as a **Windows Service** using the `node-windows` package.

### Why use Windows Service?

- Runs in the background
- Starts automatically with Windows
- No terminal window required
- Ideal for long-running SMTP servers

---

## 🪟 Windows Service Commands

> ⚠️ Run Command Prompt or PowerShell **as Administrator**

### Install Service

```
node serviceManager.js install
```

### Start Service

```
node serviceManager.js start
```

### Stop Service

```
node serviceManager.js stop
```

### Restart Service

```
node serviceManager.js restart
```

### Uninstall Service

```
node serviceManager.js uninstall
```

---

## 🛑 Stopping the Application

- Normal mode: Press `CTRL + C`
- Service mode: Stop via Windows Services or serviceManager.js

---

## 📌 Notes

- Emails are **not actually sent**
- For development and testing only
- Not recommended for production

---

## 📄 License

MIT License

---

## ✅ Status

✔ Complete
✔ Root-only structure
✔ Windows Service supported
✔ Ready for use

Happy coding 🚀