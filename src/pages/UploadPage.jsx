// // src/components/UploadResume.js
// import { useState } from "react";
// import './UploadResume.css'; // Optional: for custom styling

// export default function UploadResume() {
//   const [file, setFile] = useState(null);
//   const [previewURL, setPreviewURL] = useState("");
//   const [atsScore, setAtsScore] = useState(null);
//   const [missingKeywords, setMissingKeywords] = useState([]);
//   const [extractedText, setExtractedText] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setError("");
//     setSuccess("");
//     setExtractedText("");
//     setPreviewURL("");
//     setAtsScore(null);
//     setMissingKeywords([]);
//     setDownloadUrl("");

//     if (!selectedFile) return;

//     const fileType = selectedFile.name.split('.').pop().toLowerCase();
//     if (fileType !== 'pdf') {
//       setError("Only PDF files are allowed.");
//       return;
//     }

//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError("File exceeds 5MB size limit.");
//       return;
//     }

//     setFile(selectedFile);
//     setPreviewURL(URL.createObjectURL(selectedFile));
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a PDF file.");

//     const formData = new FormData();
//     formData.append("resume", file);
//     formData.append("userId", "user123"); // Replace with actual userId if needed

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Upload failed.");

//       setAtsScore(data.atsScore);
//       setMissingKeywords(data.missingKeywords || []);
//       setDownloadUrl(data.downloadUrl || "");
//       setExtractedText(data.extractedText || "No text extracted.");
//       setSuccess("Resume processed successfully!");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to upload and process resume.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">Upload Your Resume</h1>

//       {/* Upload Input */}
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//         <input
//           type="file"
//           id="resume-upload"
//           className="hidden"
//           accept=".pdf"
//           onChange={handleFileChange}
//         />
//         <label
//           htmlFor="resume-upload"
//           className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-800 inline-block"
//         >
//           Select PDF Resume
//         </label>
//         <p className="mt-2 text-gray-500">PDF only | Max 5MB</p>
//       </div>

//       {/* Upload Button */}
//       <div className="mt-4 text-center">
//         <button
//           onClick={handleUpload}
//           disabled={!file || loading}
//           className={`px-6 py-3 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-800'}`}
//         >
//           {loading ? "Uploading..." : "Upload Resume"}
//         </button>
//       </div>

//       {/* Messages */}
//       {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
//       {success && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

//       {/* ATS Score & Keywords */}
//       {atsScore !== null && (
//         <div className="mt-6">
//           <h3 className="text-xl font-bold mb-2">ATS Score: {atsScore}%</h3>
//           {missingKeywords.length > 0 && (
//             <p className="text-red-600">Missing Keywords: {missingKeywords.join(', ')}</p>
//           )}
//         </div>
//       )}

//       {/* Preview */}
//       {previewURL && (
//         <div className="mt-6">
//           <h3 className="font-bold mb-2">PDF Preview</h3>
//           <embed src={previewURL} width="100%" height="400px" type="application/pdf" />
//         </div>
//       )}

//       {/* Extracted Text */}
//       {extractedText && (
//         <div className="mt-6">
//           <h3 className="font-bold mb-2 text-lg">Extracted Text (OCR)</h3>
//           <div className="bg-gray-100 p-4 rounded max-h-[300px] overflow-auto whitespace-pre-wrap">
//             {extractedText}
//           </div>
//         </div>
//       )}

//       {/* Download Button */}
//       {downloadUrl && (
//         <div className="mt-4 text-center">
//           <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
//             <button className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-800">
//               Download Formatted Resume
//             </button>
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

//Working resume upload page

// import { useState } from "react";
// import './UploadResume.css'; // Optional: for custom styling

// export default function UploadResume() {
//   const [file, setFile] = useState(null);
//   const [previewURL, setPreviewURL] = useState("");
//   const [atsScore, setAtsScore] = useState(null);
//   const [missingKeywords, setMissingKeywords] = useState([]);
//   const [extractedText, setExtractedText] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     resetState(); // Reset the state before selecting a new file

//     if (!selectedFile) return;

//     const fileType = selectedFile.name.split('.').pop().toLowerCase();
//     if (fileType !== 'pdf') {
//       setError("Only PDF files are allowed.");
//       return;
//     }

//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError("File exceeds 5MB size limit.");
//       return;
//     }

//     setFile(selectedFile);
//     setPreviewURL(URL.createObjectURL(selectedFile));
//   };

//   const resetState = () => {
//     setError("");
//     setSuccess("");
//     setExtractedText("");
//     setPreviewURL("");
//     setAtsScore(null);
//     setMissingKeywords([]);
//     setDownloadUrl("");
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a PDF file.");

//     const formData = new FormData();
//     formData.append("resume", file);

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Upload failed.");

//       setAtsScore(data.atsScore);
//       setMissingKeywords(data.missingKeywords || []);
//       setDownloadUrl(data.downloadUrl || "");
//       setExtractedText(data.extractedText || "No text extracted.");
//       setSuccess("Resume processed successfully!");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to upload and process resume.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">Upload Your Resume</h1>

//       {/* Upload Input */}
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//         <input
//           type="file"
//           id="resume-upload"
//           className="hidden"
//           accept=".pdf"
//           onChange={handleFileChange}
//         />
//         <label
//           htmlFor="resume-upload"
//           className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-800 inline-block"
//         >
//           Select PDF Resume
//         </label>
//         <p className="mt-2 text-gray-500">PDF only | Max 5MB</p>
//       </div>

//       {/* Upload Button */}
//       <div className="mt-4 text-center">
//         <button
//           onClick={handleUpload}
//           disabled={!file || loading}
//           className={`px-6 py-3 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-800'}`}
//         >
//           {loading ? "Uploading..." : "Upload Resume"}
//         </button>
//       </div>

//       {/* Messages */}
//       {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
//       {success && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

//       {/* ATS Score & Keywords */}
//       {atsScore !== null && (
//         <div className="mt-6">
//           <h3 className="text-xl font-bold mb-2">ATS Score: {atsScore}%</h3>
//           {missingKeywords.length > 0 && (
//             <p className="text-red-600">Missing Keywords: {missingKeywords.join(', ')}</p>
//           )}
//         </div>
//       )}

//       {/* Preview */}
//       {previewURL && (
//         <div className="mt-6">
//           <h3 className="font-bold mb-2">PDF Preview</h3>
//           <embed src={previewURL} width="100%" height="400px" type="application/pdf" />
//         </div>
//       )}

//       {/* Extracted Text */}
//       {extractedText && (
//         <div className="mt-6">
//           <h3 className="font-bold mb-2 text-lg">Extracted Text (OCR)</h3>
//           <div className="bg-gray-100 p-4 rounded max-h-[300px] overflow-auto whitespace-pre-wrap">
//             {extractedText}
//           </div>
//         </div>
//       )}

//       {/* Download Button */}
//       {downloadUrl && (
//         <div className="mt-4 text-center">
//           <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
//             <button className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-800">
//               Download Formatted Resume
//             </button>
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useState } from 'react';

// const ResumeUpload = () => {
//   const [file, setFile] = useState(null);
//   const [atsResult, setAtsResult] = useState(null);
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Handles file selection
//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//     setError(''); // Reset any previous error message
//   };

//   // Uploads the resume file and processes the ATS score and PDF
//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload.');
//       return;
//     }

//     setLoading(true); // Start loading state
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch("http://localhost:5000/api/upload", {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Successfully received ATS result and PDF URL
//         setAtsResult(data.atsResult);
//         setPdfUrl(data.pdfUrl);
//       } else {
//         // Handle error from the server
//         setError(data.message || "Failed to process resume.");
//       }
//     } catch (error) {
//       console.error("Error uploading resume:", error);
//       setError("There was an error uploading your resume.");
//     } finally {
//       setLoading(false); // End loading state
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Your Resume</h2>
      
//       {/* File input */}
//       <input 
//         type="file" 
//         accept=".pdf,.docx,.txt" 
//         onChange={handleFileChange} 
//       />
      
//       {/* Upload button */}
//       <button onClick={handleUpload} disabled={loading}>
//         {loading ? 'Uploading...' : 'Upload Resume'}
//       </button>

//       {/* Error message */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {/* ATS results and PDF download */}
//       {atsResult && (
//         <div>
//           <h3>ATS Score: {atsResult.score}%</h3>
          
//           <h4>Matched Keywords:</h4>
//           <ul>
//             {atsResult.matchedKeywords.map((keyword, index) => (
//               <li key={index}>{keyword}</li>
//             ))}
//           </ul>

//           <h4>Missing Keywords:</h4>
//           <ul>
//             {atsResult.missingKeywords.map((keyword, index) => (
//               <li key={index}>{keyword}</li>
//             ))}
//           </ul>

//           {/* Provide the download link for the processed PDF */}
//           <a href={pdfUrl} download>
//             Download Processed Resume PDF
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeUpload;


// import { useState } from "react";
// import './UploadResume.css'; // Optional: for custom styling

// export default function UploadResume() {
//   const [file, setFile] = useState(null);
//   const [atsScore, setAtsScore] = useState(null);
//   const [missingKeywords, setMissingKeywords] = useState([]);
//   const [extractedText, setExtractedText] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [previewURL, setPreviewURL] = useState("");

//   // Reset state
//   const resetState = () => {
//     setError("");
//     setSuccess("");
//     setExtractedText("");
//     setPreviewURL("");
//     setAtsScore(null);
//     setMissingKeywords([]);
//     setDownloadUrl("");
//   };

//   // Handles file selection, validation and auto-upload
//   const handleFileChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     resetState();

//     if (!selectedFile) return;

//     const fileType = selectedFile.name.split('.').pop().toLowerCase();
//     if (fileType !== 'pdf') {
//       setError("Only PDF files are allowed.");
//       return;
//     }

//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError("File exceeds 5MB size limit.");
//       return;
//     }

//     setFile(selectedFile);
//     setPreviewURL(URL.createObjectURL(selectedFile));

//     await handleUpload(selectedFile);
//   };

//   // Handles uploading the file
//   const handleUpload = async (selectedFile) => {
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     setLoading(true);
  

//     try {
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });
    
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Upload failed.");
    
//       // Success
//     } catch (err) {
//       console.error("Upload Error:", err);
//       setError(err.message || "Failed to upload and process resume.");
//     }
    
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">Upload Your Resume</h1>

//       {/* Upload Input */}
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//         <input
//           type="file"
//           id="resume-upload"
//           className="hidden"
//           accept=".pdf"
//           onChange={handleFileChange}
//         />
//         <label
//           htmlFor="resume-upload"
//           className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-800 inline-block"
//         >
//           Select PDF Resume
//         </label>
//         <p className="mt-2 text-gray-500">PDF only | Max 5MB</p>
//       </div>

//       {/* Messages */}
//       {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
//       {success && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

//       {/* Loading */}
//       {loading && (
//         <div className="mt-4 text-blue-600 font-medium">Processing your resume...</div>
//       )}

//       {/* ATS Score */}
//       {atsScore !== null && (
//         <div className="mt-6">
//           <h3 className="text-xl font-bold mb-2">ATS Score: {atsScore}%</h3>
//           {missingKeywords.length > 0 && (
//             <p className="text-red-600">Missing Keywords: {missingKeywords.join(', ')}</p>
//           )}
//         </div>
//       )}

//       {/* Preview */}
//       {previewURL && (
//         <div className="mt-6">
//           <h3 className="font-bold mb-2">PDF Preview</h3>
//           <embed src={previewURL} width="100%" height="400px" type="application/pdf" />
//         </div>
//       )}

//       {/* Extracted Text */}
//       {extractedText && (
//         <div className="mt-6">
//           <h3 className="font-bold mb-2 text-lg">Extracted Text (OCR)</h3>
//           <div className="bg-gray-100 p-4 rounded max-h-[300px] overflow-auto whitespace-pre-wrap">
//             {extractedText}
//           </div>
//         </div>
//       )}

//       {/* Download Button */}
//       {downloadUrl && (
//         <div className="mt-4 text-center">
//           <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
//             <button className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-800">
//               Download Processed Resume
//             </button>
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

//working import-return tesseract ocr

import { useState } from "react";
import jsPDF from "jspdf";
import './UploadResume.css';
import ResumeTemplate from "../components/ResumeTemplate";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");


  const resetState = () => {
    setError("");
    setSuccess("");
    setExtractedText("");
    setPreviewURL("");
    setAtsScore(null);
    setMatchedKeywords([]);
    setMissingKeywords([]);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    resetState();

    if (!selectedFile) return;

    const fileType = selectedFile.name.split(".").pop().toLowerCase();
    if (fileType !== "pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB size limit.");
      return;
    }

    setFile(selectedFile);
    setPreviewURL(URL.createObjectURL(selectedFile));
    await handleUpload(selectedFile);
  };

  const handleUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      // Attempt to parse JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text(); // fallback to plain text
        throw new Error(`Unexpected response: ${text}`);
      }
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed.");
  
      // Set state
      setExtractedText(data.extractedText);
      setAtsScore(data.atsScore);
      setMissingKeywords(data.missingKeywords || []);
      setDownloadUrl(data.downloadUrl);
      setSuccess("Resume processed successfully!");
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.message || "Failed to upload and process resume.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    let y = 10;
    const lineHeight = 8;

    doc.setFontSize(14);
    doc.text("Resume Parsing Report", 10, y);
    y += 12;

    doc.setFontSize(12);
    doc.text(`ATS Score: ${atsScore}%`, 10, y);
    y += lineHeight;

    doc.text("Matched Keywords:", 10, y);
    y += lineHeight;
    matchedKeywords.forEach((kw) => {
      doc.text(`- ${kw}`, 15, y);
      y += lineHeight;
    });

    doc.text("Missing Keywords:", 10, y);
    y += lineHeight;
    missingKeywords.forEach((kw) => {
      doc.text(`- ${kw}`, 15, y);
      y += lineHeight;
    });

    y += 5;
    doc.text("Extracted Resume Text:", 10, y);
    y += lineHeight;

    const lines = extractedText.split("\n");
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += lineHeight;
    });

    doc.save("Resume_Report.pdf");
  };

// import { useState } from "react";
// import jsPDF from "jspdf";
// import './UploadResume.css';
// import ResumeTemplate from "../components/ResumeTemplate";

// export default function UploadResume() {
//   const [file, setFile] = useState(null);
//   const [atsScore, setAtsScore] = useState(null);
//   const [matchedKeywords, setMatchedKeywords] = useState([]);
//   const [missingKeywords, setMissingKeywords] = useState([]);
//   const [extractedText, setExtractedText] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [previewURL, setPreviewURL] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState("");

//   const resetState = () => {
//     setError("");
//     setSuccess("");
//     setExtractedText("");
//     setPreviewURL("");
//     setAtsScore(null);
//     setMatchedKeywords([]);
//     setMissingKeywords([]);
//   };

//   const handleFileChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     resetState();

//     if (!selectedFile) return;

//     const fileType = selectedFile.name.split(".").pop().toLowerCase();
//     if (fileType !== "pdf" && fileType !== "jpg" && fileType !== "jpeg" && fileType !== "png") {
//       setError("Only PDF or image files (JPG, PNG) are allowed.");
//       return;
//     }

//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError("File exceeds 5MB size limit.");
//       return;
//     }

//     setFile(selectedFile);
//     setPreviewURL(URL.createObjectURL(selectedFile));
//     await handleUpload(selectedFile);
//   };

//   const handleUpload = async (selectedFile) => {
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await res.text(); // fallback to plain text
//         throw new Error(`Unexpected response: ${text}`);
//       }

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Upload failed.");

//       // Set state with backend response
//       setExtractedText(data.extractedText);
//       setAtsScore(data.atsScore);
//       setMatchedKeywords(data.matchedKeywords || []);
//       setMissingKeywords(data.missingKeywords || []);
//       setDownloadUrl(data.downloadUrl);
//       setSuccess("Resume processed successfully!");
//     } catch (err) {
//       console.error("Upload Error:", err);
//       setError(err.message || "Failed to upload and process resume.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadReport = () => {
//     const doc = new jsPDF();
//     let y = 10;
//     const lineHeight = 8;

//     doc.setFontSize(14);
//     doc.text("Resume Parsing Report", 10, y);
//     y += 12;

//     doc.setFontSize(12);
//     doc.text(`ATS Score: ${atsScore}%`, 10, y);
//     y += lineHeight;

//     doc.text("Matched Keywords:", 10, y);
//     y += lineHeight;
//     matchedKeywords.forEach((kw) => {
//       doc.text(`- ${kw}`, 15, y);
//       y += lineHeight;
//     });

//     doc.text("Missing Keywords:", 10, y);
//     y += lineHeight;
//     missingKeywords.forEach((kw) => {
//       doc.text(`- ${kw}`, 15, y);
//       y += lineHeight;
//     });

//     y += 5;
//     doc.text("Extracted Resume Text:", 10, y);
//     y += lineHeight;

//     const lines = extractedText.split("\n");
//     lines.forEach((line) => {
//       if (y > 280) {
//         doc.addPage();
//         y = 10;
//       }
//       doc.text(line, 10, y);
//       y += lineHeight;
//     });

//     doc.save("Resume_Report.pdf");


  // };
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Upload Your Resume</h1>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-800 inline-block"
        >
          Select PDF Resume
        </label>
        <p className="mt-2 text-gray-500">PDF only | Max 5MB</p>
      </div>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      {loading && (
        <div className="mt-4 text-blue-600 font-medium">Processing your resume...</div>
      )}

      {atsScore !== null && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">ATS Score: {atsScore}%</h3>
          <p className="text-green-700">Matched: {matchedKeywords.join(", ")}</p>
          {missingKeywords.length > 0 && (
            <p className="text-red-600">Missing: {missingKeywords.join(", ")}</p>
          )}
        </div>
      )}

      {previewURL && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">PDF Preview</h3>
          <embed src={previewURL} width="100%" height="400px" type="application/pdf" />
        </div>
      )}

{extractedText && (
  <div className="mt-6">
    <h3 className="font-bold mb-2 text-lg text-gray-800">Extracted Text (OCR)</h3>
    <div className="bg-gray-100 p-4 rounded max-h-[300px] overflow-auto whitespace-pre-wrap text-gray-900 font-mono text-sm border border-gray-300">
      {extractedText}
    </div>
  </div>
)}



      {atsScore !== null && extractedText && (
        <div className="mt-6 text-center">
          <button
            onClick={handleDownloadReport}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-800"
          >
            Download Resume Report
          </button>
        </div>
      )}
    </div>
  );
}
