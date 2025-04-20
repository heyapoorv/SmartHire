import React from 'react';
import html2pdf from 'html2pdf.js';
import ResumeTemplate from '../components/ResumeTemplate';

const DownloadPage = () => {
  const resumeData = {
    name: "ROBERT SMITH",
    email: "info@qwikresume.com",
    phone: "(123) 456 78 99",
    website: "www.qwikresume.com",
    linkedin: "linkedin.com/qwikresume",
    address: "1737 Marshville Road, Alabama.",
    objective: "Over 6 years of IT industry experience with 4+ years in Android development...",
    skills: ["Python", "Java", "C", "Javascript", "Matlab", "R"],
    experience: [
      {
        title: "Android Developer",
        company: "ABC Corporation",
        duration: "January 2011 – March 2012",
        responsibilities: [
          "Involved in full lifecycle of the project",
          "Developed UI using Android SDK",
          "Created Navigation Drawer and multiple custom layouts"
        ]
      },
      {
        title: "Android Developer",
        company: "ABC Corporation",
        duration: "2006 – 2011",
        responsibilities: [
          "Helped develop Insight tablet app",
          "Worked on UI and backend",
          "Debugged outsourced buggy code"
        ]
      }
    ],
    education: "IT Technology- 2011 (Gyumri Information Technologies Center)"
  };

  const handleDownload = () => {
    const element = document.getElementById('resume');
    html2pdf().from(element).set({
      margin: 0.5,
      filename: 'resume.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { format: 'a4', orientation: 'portrait' }
    }).save();
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <ResumeTemplate data={resumeData} />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Download Resume Report
        </button>
      </div>
    </div>
  );
};

export default DownloadPage;
npm install html2pdf.js
