const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const SMTP_PORT = process.env.SMTP_PORT || 25;
const HTTP_PORT = process.env.HTTP_PORT || 3003;
const EMAIL_SAVE_PATH = process.env.EMAIL_SAVE_PATH || "./emails";
const MAX_EMAIL_COUNT = parseInt(process.env.MAX_EMAIL_COUNT || "100", 10);

/* Ensure email folder exists */
if (!fs.existsSync(EMAIL_SAVE_PATH)) {
  fs.mkdirSync(EMAIL_SAVE_PATH, { recursive: true });
}

/* Helper: Create formatted file name */
function getFormattedFileName() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, "0");

  return `${day}_${month}_${year}-${hours}_${minutes}_${seconds}_${period}.txt`;
}

/* Helper: Enforce email storage limit */
function enforceEmailLimit() {
  const files = fs
    .readdirSync(EMAIL_SAVE_PATH)
    .map(file => ({
      file,
      time: fs.statSync(path.join(EMAIL_SAVE_PATH, file)).mtime.getTime()
    }))
    .sort((a, b) => a.time - b.time); // oldest first

  while (files.length > MAX_EMAIL_COUNT) {
    const oldest = files.shift();
    fs.unlinkSync(path.join(EMAIL_SAVE_PATH, oldest.file));
    console.log(`🧹 Old email removed: ${oldest.file}`);
  }
}

/* SMTP SERVER */
const smtpServer = new SMTPServer({
  disabledCommands: ["AUTH"],
  onData(stream, session, callback) {
    simpleParser(stream, (err, mail) => {
      if (err) return callback(err);

      const content = `
From   : ${mail.from?.text || ""}
To     : ${mail.to?.text || ""}
CC     : ${mail.cc?.text || ""}
Subject: ${mail.subject || ""}
Date   : ${new Date().toISOString()}

---- BODY ----
${mail.text || ""}
`;

      const fileName = getFormattedFileName();
      fs.writeFileSync(path.join(EMAIL_SAVE_PATH, fileName), content);

      console.log("📧 Email saved:", fileName);

      // Enforce max email count
      enforceEmailLimit();

      callback();
    });
  }
});

smtpServer.listen(SMTP_PORT, () =>
  console.log(`✅ SMTP Server running on port ${SMTP_PORT}`)
);

/* HTTP SERVER */
const app = express();

app.get("/", (req, res) => {
  res.send("its works");
});

app.listen(HTTP_PORT, () =>
  console.log(`✅ HTTP Server running on port ${HTTP_PORT}`)
);