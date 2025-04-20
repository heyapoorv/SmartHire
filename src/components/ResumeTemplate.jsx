// src/components/ResumeTemplate.jsx
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const ResumeTemplate = ({ resumeData }) => {
  const pdfRef = useRef();

  const handleDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
      <div ref={pdfRef} className="bg-white p-6">
        <h1 className="text-3xl font-bold text-center mb-4">{resumeData.name}</h1>
        <div className="text-center mb-2">
          <p>{resumeData.email}</p>
          <p>{resumeData.phone}</p>
          <p>{resumeData.address}</p>
          <p>{resumeData.linkedin}</p>
        </div>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Objective</h2>
          <p>{resumeData.objective}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <ul className="list-disc list-inside">
            {resumeData.skills?.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
          {resumeData.experience?.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">{exp.title} - {exp.company}</h3>
              <p className="text-sm italic">{exp.duration}</p>
              <ul className="list-disc list-inside">
                {exp.details?.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <p>{resumeData.education}</p>
        </section>
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Resume Report
      </button>
    </div>
  );
};

export default ResumeTemplate;
