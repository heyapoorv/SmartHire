// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const fs = require("fs");

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Ensure uploads directory exists
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer storage and file type filter (PDF only)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files are allowed"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // PDF upload route
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No PDF file uploaded" });
//   }

//   res.json({
//     message: "PDF uploaded successfully",
//     filename: req.file.filename,
//     filePath: `/uploads/${req.file.filename}`,
//   });
// });

// // Serve uploaded PDFs
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


//Working code for server.js

// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const Tesseract = require("tesseract.js");
// const helmet = require("helmet");
// const { convert } = require("pdf-poppler");

// const { calculateATSScore } = require("./utils/atsCalculator");

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", "http://localhost:5000"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//     },
//   })
// );

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Ensure upload dir exists
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }


// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") cb(null, true);
//   else cb(new Error("Only PDF files are allowed"), false);
// };

// const upload = multer({ storage, fileFilter });

// // Upload Route
// app.post("/upload", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });

//   try {
//     const filePath = path.join(uploadDir, req.file.filename);
//     const dataBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdfParse(dataBuffer);

//     let finalText = pdfData.text.trim();

//     // If PDF text is empty, fallback to OCR
//     if (!finalText) {
//       console.log("Falling back to OCR...");
//       finalText = await performOCR(filePath);
//     }

//     const textFilename = req.file.filename.replace(/\.pdf$/, ".txt");
//     const textFilePath = path.join(uploadDir, textFilename);
//     fs.writeFileSync(textFilePath, finalText);

//     // 🎯 Calculate ATS Score (main part)
//     const atsResult = calculateATSScore(finalText);

//     return res.json({
//       message: "Resume processed successfully",
//       filename: req.file.filename,
//       textFilePath: `/uploads/${textFilename}`,
//       extractedText: finalText,
//       atsResult // 👈 Send ATS match score, keywords, etc.
//     });
//   } catch (err) {
//     console.error("Error processing PDF:", err);
//     res.status(500).json({ error: "Failed to process PDF" });
//   }
// });

// // OCR Function
// const performOCR = async (pdfPath) => {
//   const outputDir = path.join(__dirname, "uploads", "images");
//   if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

//   const opts = {
//     format: "jpeg",
//     out_dir: outputDir,
//     out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
//     page: null,
//   };

//   await convert(pdfPath, opts);

//   const imageFiles = fs
//     .readdirSync(outputDir)
//     .filter((file) => file.startsWith(opts.out_prefix) && file.endsWith(".jpg"));

//   let combinedText = "";
//   for (const imageFile of imageFiles) {
//     const imagePath = path.join(outputDir, imageFile);
//     const result = await Tesseract.recognize(imagePath, "eng", {
//       logger: (m) => console.log(m),
//     });
//     combinedText += result.data.text + "\n";
//   }

//   return combinedText;
// };

// // Start Server
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const pdfParse = require("pdf-parse");
// const pdfkit = require("pdfkit");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();

// // Initialize dotenv config
// dotenv.config();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Directory to save uploads
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer setup for PDF file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });

// const upload = multer({ storage });

// // ATS calculation function
// const calculateATS = (resumeText, jobKeywords) => {
//   let matchedKeywords = [];
//   let missingKeywords = [];
//   let highlightedText = resumeText;

//   jobKeywords.forEach((keyword) => {
//     if (resumeText.includes(keyword)) {
//       matchedKeywords.push(keyword);
//     } else {
//       missingKeywords.push(keyword);
//       highlightedText = highlightedText.replace(new RegExp(keyword, 'gi'), `<span style="color: red;">${keyword}</span>`);
//     }
//   });

//   const score = Math.floor((matchedKeywords.length / jobKeywords.length) * 100);
//   return { score, matchedKeywords, missingKeywords, highlightedText };
// };

// // Sample job-related keywords (can be customized)
// const jobKeywords = ["JavaScript", "React", "Node.js", "Express", "Git", "MongoDB", "REST API", "Agile"];

// // Resume upload route
// app.post("/api/upload", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });

//   try {
//     // Extract text from the uploaded resume PDF
//     const dataBuffer = fs.readFileSync(path.join(uploadDir, req.file.filename));
//     const pdfData = await pdfParse(dataBuffer);

//     const resumeText = pdfData.text.trim();

//     // Calculate ATS score and get highlighted text
//     const atsResult = calculateATS(resumeText, jobKeywords);

//     // Generate PDF with ATS score and resume content
//     const doc = new pdfkit();
//     const pdfFilename = `${Date.now()}-processed.pdf`;
//     const pdfFilePath = path.join(uploadDir, pdfFilename);

//     doc.pipe(fs.createWriteStream(pdfFilePath));

//     // Add ATS result, matched, and missing keywords to the PDF
//     doc.fontSize(16).text("Professional Resume with ATS Analysis", { align: 'center' }).moveDown();

//     // Add ATS Score
//     doc.fontSize(12).text(`ATS Score: ${atsResult.score}%`).moveDown();

//     // Add Matched Keywords
//     doc.fontSize(12).text("Matched Keywords:").moveDown();
//     atsResult.matchedKeywords.forEach(keyword => {
//       doc.text(keyword);
//     });

//     doc.moveDown();

//     // Add Missing Keywords
//     doc.text("Missing Keywords:", { continued: true }).moveDown();
//     atsResult.missingKeywords.forEach(keyword => {
//       doc.text(keyword, { continued: true });
//     });

//     doc.moveDown();

//     // Adding Resume Content with Highlights for Missing Keywords
//     doc.text("Resume Content (highlighted for Missing Keywords):", { align: 'left' }).moveDown();

//     // Highlighting text (adding color red for missing keywords)
//     doc.text(atsResult.highlightedText, { width: 500, align: 'left' }).moveDown();

//     doc.end();

//     // Return the URL for downloading the generated PDF
//     res.json({
//       message: "Resume processed successfully",
//       atsResult: atsResult,
//       pdfUrl: `/uploads/${pdfFilename}`
//     });

//   } catch (err) {
//     console.error("Error processing PDF:", err);
//     res.status(500).json({ error: "Failed to process PDF" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const Tesseract = require("tesseract.js");
// const helmet = require("helmet");
// const { convert } = require("pdf-poppler");
// const { PrismaClient } = require("@prisma/client");
// //const { PrismaClient } = require('../generated/prisma'); // match your output path


// const { calculateATSScore } = require("./utils/atsCalculator");  // Keep your ATS calculator logic as is

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// const prisma = new PrismaClient();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.get('/test-db', async (req, res) => {
//   try {
//     const users = await prisma.user.findMany(); // Fetch all users
//     res.status(200).json({ success: true, users });
//   } catch (err) {
//     console.error('DB error:', err);
//     res.status(500).json({ success: false, message: 'Database connection failed', error: err.message });
//   }
// });
// // POST /job - Employer posts a job
// app.post("/job", async (req, res) => {
//   const { employerId, title, company, location, description, experience } = req.body;

//   try {
//     const job = await prisma.job.create({
//       data: {
//         employerId,
//         title,
//         company,
//         location,
//         description,
//         experience,
//       },
//     });
//     res.status(201).json({ job });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create job" });
//   }
// });


// // GET /jobs - Get all available jobs
// app.get("/jobs", async (req, res) => {
//   try {
//     const jobs = await prisma.job.findMany();
//     res.status(200).json({ jobs });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch jobs" });
//   }
// });

// // POST /shortlist - Employer shortlists a candidate
// app.post("/shortlist", async (req, res) => {
//   const { userId, jobId, status } = req.body;

//   try {
//     const shortlist = await prisma.shortlist.create({
//       data: {
//         userId,
//         jobId,
//         status,
//       },
//     });
//     res.status(201).json({ shortlist });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to shortlist candidate" });
//   }
// });

// // POST /notify - Notify candidate
// app.post("/notify", async (req, res) => {
//   const { userId, message } = req.body;

//   try {
//     const notification = await prisma.notification.create({
//       data: {
//         userId,
//         message,
//       },
//     });
//     res.status(201).json({ notification });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to notify candidate" });
//   }
// });

// // POST /notify - Notify candidate
// app.post("/notify", async (req, res) => {
//   const { userId, message } = req.body;

//   try {
//     const notification = await prisma.notification.create({
//       data: {
//         userId,
//         message,
//       },
//     });
//     res.status(201).json({ notification });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to notify candidate" });
//   }
// });

// // GET /notifications/:userId - Get notifications for a specific user
// app.get("/notifications/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: parseInt(userId),
//       },
//     });
//     res.status(200).json({ notifications });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch notifications" });
//   }
// });


// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", "http://localhost:5000"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//     },
//   })
// );

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Ensure upload dir exists
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") cb(null, true);
//   else cb(new Error("Only PDF files are allowed"), false);
// };

// const upload = multer({ storage, fileFilter });

// // OCR Function
// const performOCR = async (pdfPath) => {
//   const outputDir = path.join(__dirname, "uploads", "images");
//   if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

//   const opts = {
//     format: "jpeg",
//     out_dir: outputDir,
//     out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
//     page: null,
//   };

//   try {
//     // Convert PDF pages to images
//     await convert(pdfPath, opts);

//     const imageFiles = fs
//       .readdirSync(outputDir)
//       .filter((file) => file.startsWith(opts.out_prefix) && file.endsWith(".jpg"));

//     let combinedText = "";
//     // OCR on each image
//     for (const imageFile of imageFiles) {
//       const imagePath = path.join(outputDir, imageFile);
//       const result = await Tesseract.recognize(imagePath, "eng", {
//         logger: (m) => console.log(m),
//       });
//       combinedText += result.data.text + "\n";
//     }

//     return combinedText;
//   } catch (error) {
//     console.error("Error during OCR:", error);
//     throw new Error("OCR processing failed");
//   }
// };

// // Upload Route
// app.post("/upload", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });

//   try {
//     const filePath = path.join(uploadDir, req.file.filename);
//     const dataBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdfParse(dataBuffer);

//     let finalText = pdfData.text.trim();

//     // If PDF text is empty, fallback to OCR
//     if (!finalText) {
//       console.log("Falling back to OCR...");
//       finalText = await performOCR(filePath);
//     }

//     const textFilename = req.file.filename.replace(/\.pdf$/, ".txt");
//     const textFilePath = path.join(uploadDir, textFilename);
//     fs.writeFileSync(textFilePath, finalText);

//     // 🎯 Calculate ATS Score (main part)
//     const atsResult = calculateATSScore(finalText);

//     // Save resume data to the database
//     const resume = await prisma.resume.create({
//       data: {
//         fileUrl: `/uploads/${req.file.filename}`,
//         parsedData: { text: finalText, atsScore: atsResult.score },
//         user: {
//           connect: { id: req.userId }, // assuming you have user info
//         },
//       },
//     });

//     return res.json({
//       message: "Resume processed successfully",
//       filename: req.file.filename,
//       textFilePath: `/uploads/${textFilename}`,
//       extractedText: finalText,
//       atsResult, // 👈 Send ATS match score, keywords, etc.
//       resume, // 👈 Return the saved resume object
//     });
//   } catch (err) {
//     console.error("Error processing PDF:", err);
//     res.status(500).json({ error: "Failed to process PDF" });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

//Working with db 

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");

const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const helmet = require("helmet");
const { convert } = require("pdf-poppler");
const { PrismaClient } = require("./prisma/prisma/generated/client");
//const { auth, provider } = require('./firebase.js');
const { admin } = require('./firebase'); // Import Admin SDK only
//const prisma = require('@prisma/client'); 

const { calculateATSScore } = require("./utils/atsCalculator");  // Keep your ATS calculator logic as is

dotenv.config();
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

const authenticateUser = async (req, res, next) => {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Add decoded user to request object for use in route handlers
    req.user = decodedToken;

    console.log(req.user);

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


// app.post('/signup', async (req, res) => {


//   const { email, password, name, role, company } = req.body;

//   // Validate request body
//   if (!email || !password || !name || !role) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     // First, check if the email already exists in Firebase
//     const existingUser = await admin.auth().getUserByEmail(email).catch((error) => {
//       if (error.code === 'auth/user-not-found') {
//         return null; // No user found, continue to create the user
//       }
//       throw error; // Other errors, rethrow
//     });

//     // If the email exists in Firebase, return an error
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     // Firebase Authentication (create user)
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//       displayName: name,
//     });

//     // Save user in the database
//     const user = await prisma.user.create({
//       data: {
//         email,
//         name,
//         role: role === 'employer' ? 'EMPLOYER' : 'JOB_SEEKER',
//       },
//     });

//     // If the role is EMPLOYER, create Employer in the database
//     if (role === 'employer') {
//       await prisma.employer.create({
//         data: {
//           email,
//           company,
//         },
//       });
//     }

//     // Send success response
//     res.status(201).json({ message: 'User created successfully', user });

//   } catch (error) {
//     console.error('Error creating user:', error);

//     // Handle specific Firebase errors
//     if (error.code === 'auth/email-already-exists') {
//       return res.status(400).json({ error: 'Email already in use' });
//     }
//     if (error.code === 'auth/invalid-email') {
//       return res.status(400).json({ error: 'Invalid email address' });
//     }

//     // Generic error response
//     res.status(500).json({ error: 'Failed to create user', details: error.message });
//   }
// });
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(require("./serviceAccountkey.json")),
//   });
// }

router.post('/signup', async (req, res) => {
  const { email, password, name, role, company } = req.body;

  // Validate request body
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the email already exists in Firebase
    const existingUser = await admin.auth().getUserByEmail(email).catch((error) => {
      if (error.code === 'auth/user-not-found') {
        return null; // No user found, continue to create the user
      }
      throw error; // Other errors, rethrow
    });

    // If the email exists in Firebase, return an error
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Save user in the database (Prisma)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role === 'employer' ? 'EMPLOYER' : 'JOB_SEEKER',
      },
    });

    // If role is 'employer', create employer record in the database
    if (role === 'employer') {
      await prisma.employer.create({
        data: {
          email,
          company,
        },
      });
    }

    // Send success response
    res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    console.error('Error creating user:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Generic error response
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});
module.exports = router;

app.post('/login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decodedUser = await admin.auth().verifyIdToken(token);
    const email = decodedUser.email;

    if (!email) {
      return res.status(400).json({ error: 'Invalid token payload: email not found.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.role) return res.status(400).json({ error: 'User role is missing' });

    console.log(user);
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});




// app.post('/login', async (req, res) => {
//   const { token } = req.body; // Firebase ID token from client

//   if (!token) {
//     return res.status(400).json({ error: 'Token is required' });
//   }

//   // Log the received token for debugging
//   console.log("Received token:", token);

//   try {
//     // Verify the Firebase ID token
//     const decodedUser = await admin.auth().verifyIdToken(token);
//     const { email, name } = decodedUser;

//     // Check if the user exists in the database
//     let user = await prisma.user.findUnique({
//       where: { email },
//     });

//     // If user does not exist, send an error message
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Ensure user has a valid role (candidate or employer)
//     if (!user.role) {
//       return res.status(400).json({ error: 'User role is missing' });
//     }

//     // Optionally, handle additional role verification logic here (e.g., admin checks, etc.)

//     // Return the user details and role
//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         email: user.email,
//         name: user.name,
//         role: user.role, // role will be used to decide which dashboard to route
//       },
//     });
//   } catch (error) {
//     console.error('Error logging in:', error);

//     // Handle specific Firebase errors
//     if (error.code === 'auth/argument-error') {
//       return res.status(400).json({ error: 'Invalid or missing token' });
//     }

//     // Generic error response
//     res.status(500).json({ error: 'Failed to login', details: error.message });
//   }
// });


// Test Database Connection Route
app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Fetch all users
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed', error: err.message });
  }
});

// POST /job - Employer posts a job
app.post("/job", async (req, res) => {
  const { employerId, title, company, location, description, experience } = req.body;

  const employer = await prisma.employer.findUnique({
    where: { id: employerId },
  });

  if (!employer) {
    return res.status(400).json({ error: "Employer not found" });
  }
  try {
    const job = await prisma.job.create({
      data: {
        employerId,
        title,
        company,
        location,
        description,
        experience,
      },
    });
    res.status(201).json({ job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Failed to create1 job" });
  }
});

// GET /jobs - Get all available jobs
app.get("/jobs", async (req, res) => {
  const { title, location, company } = req.query;
  try {
    const jobs = await prisma.job.findMany({
      where: {
        title: { contains: title, mode: 'insensitive' },
        location: { contains: location, mode: 'insensitive' },
        company: { contains: company, mode: 'insensitive' },
      },
    });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.post("/compare-a-job", async (req, res) => {
  try {
    const userId = req.body.userId;
    const jobId = req.body.jobId;

    if (!userId || !jobId) {
      return res.status(400).json({ error: "User ID & Job Id are required" });
    }

    // Get user with preferences
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        resumes: {
          select: {
            parsedData: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get job with skills
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
      include: {
        skills: true
      }
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Extract skills from job
    const jobSkills = job.skills.map(skill => skill.name.toLowerCase());

    // Initialize compatibility score and factors
    let compatibilityScore = 0;
    const matchFactors = {
      title: false,
      location: false,
      salary: false,
      skills: {
        matched: [],
        missing: []
      },
      experienceLevel: false
    };

    // Get user preferences (if they exist)
    const preferences = user.preferences || {};

    // Match job title
    if (preferences.desiredJobTitle &&
      job.title.toLowerCase().includes(preferences.desiredJobTitle.toLowerCase())) {
      compatibilityScore += 25;
      matchFactors.title = true;
    }

    // Match location
    if (preferences.preferredLocation &&
      job.location.toLowerCase().includes(preferences.preferredLocation.toLowerCase())) {
      compatibilityScore += 20;
      matchFactors.location = true;
    }

    // Match salary range (basic string comparison - could be improved)
    if (preferences.salaryRange && job.salary) {
      // Extract numerics from salary strings for comparison
      const userSalaryMatch = preferences.salaryRange.match(/\d+/g);
      const jobSalaryMatch = job.salary.match(/\d+/g);

      if (userSalaryMatch && jobSalaryMatch &&
        parseInt(jobSalaryMatch[0]) >= parseInt(userSalaryMatch[0])) {
        compatibilityScore += 15;
        matchFactors.salary = true;
      }
    }

    // Match skills
    if (preferences.skills && Array.isArray(preferences.skills)) {
      const userSkills = preferences.skills.map(skill =>
        typeof skill === 'string' ? skill.toLowerCase() : '');

      // Find matching skills
      const matchedSkills = userSkills.filter(skill => jobSkills.includes(skill));
      const missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));

      matchFactors.skills.matched = matchedSkills;
      matchFactors.skills.missing = missingSkills;

      // Calculate skill match percentage and add to score
      const skillMatchPercentage = userSkills.length > 0 ?
        (matchedSkills.length / userSkills.length) * 100 : 0;

      compatibilityScore += Math.min(skillMatchPercentage * 0.4, 40); // Max 40 points for skills
    }

    // Consider resume parsed data if available
    if (user.resumes && user.resumes.length > 0 && user.resumes[0].parsedData) {
      const parsedResume = user.resumes[0].parsedData;

      // Additional analysis using resume data could be added here
      // For example: experience matching, education requirements, etc.
    }

    // Determine overall compatibility
    let compatibilityLevel;
    if (compatibilityScore >= 80) {
      compatibilityLevel = "Excellent Match";
    } else if (compatibilityScore >= 60) {
      compatibilityLevel = "Good Match";
    } else if (compatibilityScore >= 40) {
      compatibilityLevel = "Fair Match";
    } else {
      compatibilityLevel = "Low Match";
    }

    // Return the comparison results
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        skills: jobSkills
      },
      match: {
        score: compatibilityScore,
        level: compatibilityLevel,
        factors: matchFactors
      }
    });

  } catch (error) {
    console.error("Error comparing jobs:", error);
    res.status(500).json({ error: "Failed to compare job compatibility" });
  }
});

// Get current user's preferences
app.get("/user/preferences", async (req, res) => {
  try {
    // Get user ID from authenticated session
    // This assumes you have authentication middleware that adds userId to the request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Fetch the user with their preferences
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        preferences: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return just the preferences if they exist, otherwise an empty object
    return res.status(200).json({
      preferences: user.preferences || {}
    });

  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({ error: "Failed to fetch user preferences" });
  }
});

app.get("/recommended-jobs/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get user with preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        resumes: {
          select: {
            parsedData: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get all jobs with their skills
    const allJobs = await prisma.job.findMany({
      include: {
        skills: true
      }
    });

    if (allJobs.length === 0) {
      return res.status(404).json({ message: "No jobs found in the database" });
    }

    // Extract preferences
    const preferences = user.preferences || {};

    // Calculate match score for each job
    const jobMatches = allJobs.map(job => {
      // Extract job skills
      const jobSkills = job.skills.map(skill => skill.name.toLowerCase());

      // Initialize compatibility score and factors
      let compatibilityScore = 0;
      const matchFactors = {
        title: false,
        location: false,
        salary: false,
        skills: {
          matched: [],
          missing: []
        }
      };

      // Match job title
      if (preferences.desiredJobTitle &&
        job.title.toLowerCase().includes(preferences.desiredJobTitle.toLowerCase())) {
        compatibilityScore += 25;
        matchFactors.title = true;
      }

      // Match location
      if (preferences.preferredLocation && job.location) {
        // Check if remote preference is mentioned
        const isRemoteJob = job.location.toLowerCase().includes('remote');
        const userWantsRemote = preferences.remotePreference &&
          (preferences.remotePreference.toLowerCase() === 'remote' ||
            preferences.remotePreference.toLowerCase() === 'hybrid');

        if ((isRemoteJob && userWantsRemote) ||
          job.location.toLowerCase().includes(preferences.preferredLocation.toLowerCase())) {
          compatibilityScore += 20;
          matchFactors.location = true;
        }
      }

      // Match salary range
      if (preferences.salaryRange && job.salary) {
        // Extract numerics from salary strings for comparison
        const userSalaryMatch = preferences.salaryRange.match(/\d+/g);
        const jobSalaryMatch = job.salary.match(/\d+/g);

        if (userSalaryMatch && jobSalaryMatch && jobSalaryMatch.length > 0) {
          // Compare the lower bound of job salary with user's expected lower bound
          if (parseInt(jobSalaryMatch[0]) >= parseInt(userSalaryMatch[0])) {
            compatibilityScore += 15;
            matchFactors.salary = true;
          }
        }
      }

      // Match skills
      if (preferences.skills && Array.isArray(preferences.skills)) {
        const userSkills = preferences.skills.map(skill =>
          typeof skill === 'string' ? skill.toLowerCase() : '');

        // Find matching skills
        const matchedSkills = userSkills.filter(skill => jobSkills.includes(skill));
        const missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));

        matchFactors.skills.matched = matchedSkills;
        matchFactors.skills.missing = missingSkills;

        // Calculate skill match percentage and add to score
        const skillMatchPercentage = userSkills.length > 0 ?
          (matchedSkills.length / userSkills.length) * 100 : 0;

        compatibilityScore += Math.min(skillMatchPercentage * 0.4, 40); // Max 40 points for skills
      }

      // Determine compatibility level
      let compatibilityLevel;
      if (compatibilityScore >= 80) {
        compatibilityLevel = "Excellent Match";
      } else if (compatibilityScore >= 60) {
        compatibilityLevel = "Good Match";
      } else if (compatibilityScore >= 40) {
        compatibilityLevel = "Fair Match";
      } else {
        compatibilityLevel = "Low Match";
      }

      return {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          skills: jobSkills,
          postedAt: job.postedAt
        },
        match: {
          score: compatibilityScore,
          level: compatibilityLevel,
          factors: matchFactors
        }
      };
    });

    // Sort jobs by match score (highest first)
    const sortedJobs = jobMatches.sort((a, b) => b.match.score - a.match.score);

    // Filter out jobs with very low match scores (optional)
    const relevantJobs = sortedJobs.filter(job => job.match.score >= 30);

    return res.status(200).json({
      totalJobs: allJobs.length,
      relevantJobsCount: relevantJobs.length,
      preferences: preferences,
      jobs: relevantJobs
    });

  } catch (error) {
    console.error("Error finding recommended jobs:", error);
    res.status(500).json({ error: "Failed to find recommended jobs" });
  }
});

app.post("/compare-jobs", async (req, res) => {
  try {
    const userId = req.body.userId;
    const jobId = req.body.jobId;

    if (!userId || !jobId) {
      return res.status(400).json({ error: "User ID & Job Id are required" });
    }

    // Get user with preferences
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        resumes: {
          select: {
            parsedData: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get job with skills
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
      include: {
        skills: true
      }
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Extract skills from job
    const jobSkills = job.skills.map(skill => skill.name.toLowerCase());

    // Initialize compatibility score and factors
    let compatibilityScore = 0;
    const matchFactors = {
      title: false,
      location: false,
      salary: false,
      skills: {
        matched: [],
        missing: []
      },
      experienceLevel: false
    };

    // Get user preferences (if they exist)
    const preferences = user.preferences || {};

    // Match job title
    if (preferences.desiredJobTitle &&
      job.title.toLowerCase().includes(preferences.desiredJobTitle.toLowerCase())) {
      compatibilityScore += 25;
      matchFactors.title = true;
    }

    // Match location
    if (preferences.preferredLocation &&
      job.location.toLowerCase().includes(preferences.preferredLocation.toLowerCase())) {
      compatibilityScore += 20;
      matchFactors.location = true;
    }

    // Match salary range (basic string comparison - could be improved)
    if (preferences.salaryRange && job.salary) {
      // Extract numerics from salary strings for comparison
      const userSalaryMatch = preferences.salaryRange.match(/\d+/g);
      const jobSalaryMatch = job.salary.match(/\d+/g);

      if (userSalaryMatch && jobSalaryMatch &&
        parseInt(jobSalaryMatch[0]) >= parseInt(userSalaryMatch[0])) {
        compatibilityScore += 15;
        matchFactors.salary = true;
      }
    }

    // Match skills
    if (preferences.skills && Array.isArray(preferences.skills)) {
      const userSkills = preferences.skills.map(skill =>
        typeof skill === 'string' ? skill.toLowerCase() : '');

      // Find matching skills
      const matchedSkills = userSkills.filter(skill => jobSkills.includes(skill));
      const missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));

      matchFactors.skills.matched = matchedSkills;
      matchFactors.skills.missing = missingSkills;

      // Calculate skill match percentage and add to score
      const skillMatchPercentage = userSkills.length > 0 ?
        (matchedSkills.length / userSkills.length) * 100 : 0;

      compatibilityScore += Math.min(skillMatchPercentage * 0.4, 40); // Max 40 points for skills
    }

    // Consider resume parsed data if available
    if (user.resumes && user.resumes.length > 0 && user.resumes[0].parsedData) {
      const parsedResume = user.resumes[0].parsedData;

      // Additional analysis using resume data could be added here
      // For example: experience matching, education requirements, etc.
    }

    // Determine overall compatibility
    let compatibilityLevel;
    if (compatibilityScore >= 80) {
      compatibilityLevel = "Excellent Match";
    } else if (compatibilityScore >= 60) {
      compatibilityLevel = "Good Match";
    } else if (compatibilityScore >= 40) {
      compatibilityLevel = "Fair Match";
    } else {
      compatibilityLevel = "Low Match";
    }

    // Return the comparison results
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        skills: jobSkills
      },
      match: {
        score: compatibilityScore,
        level: compatibilityLevel,
        factors: matchFactors
      }
    });

  } catch (error) {
    console.error("Error comparing jobs:", error);
    res.status(500).json({ error: "Failed to compare job compatibility" });
  }
});


// POST /shortlist - Employer shortlists a candidate
app.post("/shortlist", async (req, res) => {
  const { userId, jobId, status } = req.body;

  try {
    const shortlist = await prisma.shortlist.create({
      data: {
        userId,
        jobId,
        status,
      },
    });

    // Create a notification for the user
    const notification = await prisma.notification.create({
      data: {
        userId,
        message: `You have been ${status.toLowerCase()} for the job.`,
      },
    });

    res.status(201).json({ shortlist, notification });
  } catch (error) {
    res.status(500).json({ error: "Failed to shortlist candidate" });
  }
});

// POST /notify - Notify candidate
app.post("/notify", async (req, res) => {
  const { userId, message } = req.body;

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
    res.status(201).json({ notification });
  } catch (error) {
    res.status(500).json({ error: "Failed to notify candidate" });
  }
});

// GET /notifications/:userId - Get notifications for a specific user
app.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});



// Serve uploaded files
// const { performOCRWithPaddle } = require('./utils/ocrUtils');

// const uploadDir = 'uploads/';

// // Ensure upload directory exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer setup for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });

// const upload = multer({ storage });

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Route to upload a file and process OCR
// app.post('/upload', upload.single('file'), async (req, res) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   try {
//     const filePath = path.join(__dirname, uploadDir, file.filename);
//     const extractedText = await performOCRWithPaddle(filePath);  // Get OCR result

//     res.json({ extractedText });  // Send OCR result as JSON response
//   } catch (error) {
//     console.error('Error processing file:', error);
//     res.status(500).send('Error processing file.');
//   }
// });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure upload dir exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const upload = multer({ storage, fileFilter });

// OCR Function (convert PDF pages to images, then OCR to extract text)
const performOCR = async (pdfPath) => {
  const outputDir = path.join(__dirname, "uploads", "images");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const opts = {
    format: "jpeg",
    out_dir: outputDir,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: null,
  };

  try {
    await convert(pdfPath, opts);
    const imageFiles = fs
      .readdirSync(outputDir)
      .filter((file) => file.startsWith(opts.out_prefix) && file.endsWith(".jpg"));

    let combinedText = "";
    for (const imageFile of imageFiles) {
      const imagePath = path.join(outputDir, imageFile);
      const result = await Tesseract.recognize(imagePath, "eng", {
        logger: (m) => console.log(m),
      });
      combinedText += result.data.text + "\n";
    }

    return combinedText;
  } catch (error) {
    console.error("Error during OCR:", error);
    throw new Error("OCR processing failed");
  }
};

// Upload Route for resume processing
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });

  try {
    const filePath = path.join(uploadDir, req.file.filename);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    let finalText = pdfData.text.trim();

    // If PDF text is empty, fallback to OCR
    if (!finalText) {
      console.log("Falling back to OCR...");
      finalText = await performOCR(filePath);
    }

    const textFilename = req.file.filename.replace(/\.pdf$/, ".txt");
    const textFilePath = path.join(uploadDir, textFilename);
    fs.writeFileSync(textFilePath, finalText);

    // 🎯 Calculate ATS Score
    const atsResult = calculateATSScore(finalText);

    // Save resume data to the database (mock userId for now)
    const resume = await prisma.resume.create({
      data: {
        fileUrl: `/uploads/${req.file.filename}`,
        parsedData: { text: finalText, atsScore: atsResult.score },
        user: {
          connect: { id: 1 }, // Mock userId, replace with actual user authentication
        },
      },
    });

    return res.json({
      message: "Resume processed successfully",
      filename: req.file.filename,
      textFilePath: `/uploads/${textFilename}`,
      extractedText: finalText,
      atsResult,
      resume,
    });
  } catch (err) {
    console.error("Error processing PDF:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});


app.post("/apply", async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        status: "PENDING", // initial status
      },
    });
    res.status(201).json({ application });
  } catch (error) {
    res.status(500).json({ error: "Failed to apply for the job" });
  }
});

app.put("/user/preferences", async (req, res) => {
  const { userId, preferences } = req.body;

  // Check if required fields are provided
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Update the user with the new preferences
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        preferences: preferences
      },
    });

    res.status(200).json({
      message: "Job preferences updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Failed to update job preferences" });
  }
});

app.get('/api/user/by-email/:email', authenticateUser, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        preferences: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

