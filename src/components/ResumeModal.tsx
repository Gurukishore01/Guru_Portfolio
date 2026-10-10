import React from 'react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const resumeText = `=====================================================
GURUKISHORE T
Full-Stack Developer & Cybersecurity Enthusiast
Email: gurukishore1208@gmail.com | Phone: +91-6369977183
GitHub: https://github.com/Gurukishore01
LinkedIn: https://www.linkedin.com/in/gurukishore1208/
Location: Tamil Nadu, India
=====================================================

CAREER OBJECTIVE
Aspiring software engineer eager to build robust full-stack applications and secure digital architectures. Passionate about turning complex logic into sleek, accessible web experiences.

EDUCATION
- Paavai Engineering College (Autonomous)
  B.E. in Cybersecurity (Pursuing) | CGPA: 8.22 / 10.0
- K.V.S Matric Higher Secondary School
  Higher Secondary Certificate (HSC) (2020 - 2022) | Score: 80%
- Srividya Higher Secondary School
  Secondary School Leaving Certificate (SSLC) (2019 - 2020) | Score: 81%

CERTIFICATIONS
- Full Stack Java Development (Revamp Academy)
  Enterprise Java application development, relational database design, and modern web architectures.
- Cyber Security Certification (The Red Users)
  Penetration testing, ethical hacking toolsets, vulnerability assessment, and threat mitigation.
- NPTEL Certifications (IIT / NPTEL)
  Cloud Computing Fundamentals & Introduction to Internet of Things (IoT).

TECHNICAL SKILLS
- Languages: Java, Python, JavaScript, HTML5, CSS3
- Frameworks & Libraries: React, Node.js, Express, Bootstrap, Tailwind CSS
- Core Competencies: Full-Stack Development, Ethical Hacking, Network Security, Cryptography, Git & GitHub

FEATURED PROJECTS
1. KeyShield (Locker-Based Fake Account Prevention)
   Stack: Java, Cryptography, Web Security
   Description: Locker-based fake account prevention using unique key authentication and encrypted validation to eliminate duplicate spam accounts.

2. SafeTrace (Digital Footprint Analyzer & Privacy Assistant)
   Stack: JavaScript, Full-Stack, AI Chatbot
   Description: Digital footprint analyzer providing automated breach risk scoring, visual footprint metrics, and personalized privacy recommendations.

3. Social Engineering Defense Simulation
   Stack: Research, Attack Simulation, Security Strategy
   Description: Empirical defense analysis modeling psychological exploit vectors to train users against deceptive social engineering incursions.
`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Gurukishore_T_Resume.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white text-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-sky-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#00abf0] to-[#005a82] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
              <i className="bx bxs-file-doc"></i>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Gurukishore T - Curriculum Vitae</h2>
              <p className="text-xs text-sky-100">Full-Stack Developer &amp; Cybersecurity Enthusiast</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
            aria-label="Close modal"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        {/* Resume Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed scroll-subtle">
          {/* Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-sky-200 pb-1 mb-2">
              Professional Summary
            </h3>
            <p className="text-slate-600">
              Aspiring software engineer eager to build robust full-stack applications and secure digital architectures. Passionate about turning complex logic into sleek, accessible web experiences.
            </p>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-sky-200 pb-1 mb-2">
              Education
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                  <span>Paavai Engineering College (Autonomous)</span>
                  <span className="text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-bold">CGPA: 8.22 / 10.0</span>
                </div>
                <p className="text-xs text-slate-500">B.E. in Cybersecurity · Pursuing</p>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                  <span>K.V.S Matric Higher Secondary School</span>
                  <span className="text-xs text-slate-600">Score: 80%</span>
                </div>
                <p className="text-xs text-slate-500">Higher Secondary Certificate (HSC) · 2020 - 2022</p>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                  <span>Srividya Higher Secondary School</span>
                  <span className="text-xs text-slate-600">Score: 81%</span>
                </div>
                <p className="text-xs text-slate-500">Secondary School Leaving Certificate (SSLC) · 2019 - 2020</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-sky-200 pb-1 mb-2">
              Certifications
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-slate-900">Full Stack Java Development</span> — <span className="text-xs text-slate-500">Revamp Academy</span>
                <p className="text-xs text-slate-600">Enterprise Java, SQL &amp; relational DBs, modern web architectures.</p>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Cyber Security Certification</span> — <span className="text-xs text-slate-500">The Red Users</span>
                <p className="text-xs text-slate-600">Penetration testing, ethical hacking toolsets, vulnerability assessment.</p>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Cloud Computing &amp; IoT</span> — <span className="text-xs text-slate-500">IIT / NPTEL</span>
                <p className="text-xs text-slate-600">Cloud architecture paradigms &amp; IoT embedded fundamentals.</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-sky-200 pb-1 mb-2">
              Technical Proficiencies
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-800">Languages:</span>
                <p className="text-slate-600">Java, Python, JavaScript, HTML5, CSS3</p>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Frameworks &amp; Tools:</span>
                <p className="text-slate-600">React, Node.js, Git, GitHub, Bootstrap</p>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Security Domains:</span>
                <p className="text-slate-600">Pen-Testing, Network Security, Ethical Hacking</p>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Architecture:</span>
                <p className="text-slate-600">Full-Stack Development, Cryptographic Auth</p>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-sky-200 pb-1 mb-2">
              Featured Projects
            </h3>
            <div className="space-y-2.5">
              <div>
                <span className="font-semibold text-slate-900">KeyShield (Locker-Based Fake Account Prevention)</span>
                <p className="text-xs text-slate-600">Java cryptographic authentication validating against duplicate spam accounts.</p>
              </div>
              <div>
                <span className="font-semibold text-slate-900">SafeTrace (Digital Footprint Analyzer &amp; Privacy Assistant)</span>
                <p className="text-xs text-slate-600">Automated breach risk scoring, visual footprint metrics, and privacy guidance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <i className="bx bx-check-circle text-emerald-500 text-base"></i>
            <span>Verified Candidate Profile</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadText}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <i className="bx bx-download text-base"></i>
              Download TXT
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-[#00abf0] hover:bg-[#0092cf] text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <i className="bx bx-printer text-base"></i>
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
