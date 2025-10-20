const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer"); // For file uploads
const path = require("path");
const fs = require("fs");

const {
  showAllEmails,
  InsertEmail,
  UpdatetEmail,
  showEmailsById,
  DeleteEmail,
  UpdateAllPath,
} = require("./controllers/emails.controllers");
const nodemailer = require("nodemailer");
const { RequestQuery } = require("./controllers/services.controllers");

app.use(express.json());
app.use(cors());

const PORT = 8080;
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, "cv.pdf"), // always overwrite
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};
const upload = multer({ storage, fileFilter });

app.post("/api/upload", upload.single("file"), UpdateAllPath);
app.get("/api/cv", async (req, res) => {
  try {
    const pdfPath = path.join(__dirname, "uploads", "cv.pdf");

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=cv.pdf`);

    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

    // Do NOT call res.json() here, the PDF is being streamed
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/all", showAllEmails);
app.get("/api/email/:id", showEmailsById);
app.post("/api/create/email", InsertEmail);
app.post("/api/delete", DeleteEmail);
app.put("/api/update/email", UpdatetEmail);

app.post("/api/send-email", async (req, res) => {
  // Fetch emails from database
  const data = await RequestQuery("SELECT * FROM emails");
  // Configure transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "badermouj@gmail.com",
      pass: "vtnpzwsohxizwzcf", // App Password
    },
  });

  try {
    const pdfPath = path.join(__dirname, "uploads", "cv.pdf");
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "CV file not found on server" });
    }

    // Send emails
    for (const item of data) {
      await transporter.sendMail({
        from: '"Badr Moujahid" <badermouj@gmail.com>',
        to: item.email,
        subject: item.subject,
        text: item.content,
        attachments: [
          {
            filename: "cv.pdf",
            path: pdfPath, // path to file on server
          },
        ],
      });
      console.log(`Email sent to ${item.email}`);
    }

    res.status(200).json({ message: "All emails sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to send emails", details: error.message });
  }
});
app.listen(PORT, () => {
  console.error(`Server listining on ${PORT}`);
});
