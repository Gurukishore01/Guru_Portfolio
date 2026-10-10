/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ResumeModal } from './components/ResumeModal';
import { ProjectModal, ProjectData } from './components/ProjectModal';
import {
  playPageFlipSound,
  playContactMeRapidFlipSound,
  playBookOpenSound,
  toggleSound,
  isSoundEnabled,
} from './utils/audio';

const PROJECTS: Record<string, ProjectData> = {
  keyshield: {
    title: 'KeyShield',
    subtitle: 'Locker-Based Fake Account Prevention',
    tags: ['Java', 'Cryptography', 'Web Security'],
    description:
      'A multi-tiered security defense protocol designed to prevent mass registration of malicious and duplicate bot accounts. Employs locker-based key distribution, cryptographic verification hashes, and session hardware fingerprinting.',
    keyFeatures: [
      'Encrypted one-time locker key issuance per unique user session',
      'Dual cryptographic hashing comparing client credentials with secure tokens',
      'Anti-sybil heuristics to detect duplicate automated bot requests',
      'Enterprise-grade Java backend with prepared secure transactions',
    ],
    techStack: ['Java', 'Spring Security', 'SHA-256', 'JDBC', 'MySQL'],
    githubUrl: 'https://github.com/Gurukishore01',
  },
  safetrace: {
    title: 'SafeTrace',
    subtitle: 'Digital Footprint Analyzer & Privacy Assistant',
    tags: ['JavaScript', 'Full-Stack', 'AI Chatbot'],
    description:
      'An intuitive cyber posture and privacy analytics dashboard that scans open data repositories to calculate individual exposure scores, maps exposed credentials, and provides proactive remediations.',
    keyFeatures: [
      'Automated breach risk scoring engine based on public leaks and OSINT feeds',
      'Visual interactive footprint metrics with exposure vectors',
      'Built-in Privacy Assistant chatbot offering guided mitigation steps',
      'Exportable security report with prioritized vulnerability items',
    ],
    techStack: ['JavaScript', 'React', 'Node.js', 'Express', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Gurukishore01',
  },
  socialdefense: {
    title: 'Social Engineering Defense',
    subtitle: 'Psychological Exploit Vector Modeling & Defense',
    tags: ['Research', 'Attack Simulation', 'Security'],
    description:
      'An empirical security research model analyzing deceptive cognitive triggers exploited in modern phishing, spear-phishing, and pretexting scenarios to build adaptive defense awareness.',
    keyFeatures: [
      'Heuristic classification of phishing pretexts and emotional manipulation',
      'Simulated attack vectors measuring employee response and click-through risk',
      'Actionable training modules designed to heighten situational skepticism',
      'Comprehensive defense documentation for organizational cybersecurity',
    ],
    techStack: ['Research Methodology', 'Threat Modeling', 'Simulation Frameworks'],
    githubUrl: 'https://github.com/Gurukishore01',
  },
};

export default function App() {
  // 3 flippable right-hand leaves:
  // Leaf 1 (#turn-1): Front = Page 1 (Education), Back = Page 2 (Certifications)
  // Leaf 2 (#turn-2): Front = Page 3 (Skills), Back = Page 4 (Featured Projects)
  // Leaf 3 (#turn-3): Front = Page 5 (Let's Build Together), Back = Page 6 (Contact Me!)
  // 3 flippable right-hand leaves:
  // Leaf 1 (#turn-1): Front = Page 1 (Education), Back = Page 2 (Certifications)
  // Leaf 2 (#turn-2): Front = Page 3 (Skills), Back = Page 4 (Featured Projects)
  // Leaf 3 (#turn-3): Front = Page 5 (Let's Build Together), Back = Page 6 (Contact Me!)
  const [coverTurned, setCoverTurned] = useState(false);
  const [coverZIndex, setCoverZIndex] = useState(100);
  const [pagesTurned, setPagesTurned] = useState<[boolean, boolean, boolean]>([true, true, true]);
  const [pageZIndices, setPageZIndices] = useState<[number, number, number]>([1, 2, 3]);
  const [animatingPage, setAnimatingPage] = useState<number | null>(null);
  const [isOpening, setIsOpening] = useState(true);

  // Modals & UI States
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [soundActive, setSoundActive] = useState(isSoundEnabled());
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Responsive scale calculation
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const targetW = 1056;
      const targetH = 720;

      const availableW = screenW - (screenW < 640 ? 16 : 48);
      const availableH = screenH - (screenW < 640 ? 80 : 95);

      const scaleW = availableW / targetW;
      const scaleH = availableH / targetH;
      const computedScale = Math.min(1.05, Math.min(scaleW, scaleH));

      setScale(Math.max(0.38, computedScale));
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // =========================================================================
  // EXACT OPENING SEQUENCE FROM REFERENCE script.js
  // =========================================================================
  const runOpeningSequence = () => {
    setIsOpening(true);
    setCoverTurned(false);
    setCoverZIndex(100);
    setPagesTurned([true, true, true]);
    setPageZIndices([1, 2, 3]);

    // Cover right turns at 2100ms
    const tCover = setTimeout(() => {
      setCoverTurned(true);
      playBookOpenSound();
    }, 2100);

    // Cover right drops to z-index: -1 at 2800ms
    const tCoverDrop = setTimeout(() => {
      setCoverZIndex(-1);
    }, 2800);

    // Pages turn back from left to right in reverse order from 2100ms:
    // (index + 1) * 200 + 2100 ms
    // Step 0: Leaf 3 (#turn-3, idx 2) at 2300ms, zIndex 10 at 2800ms
    // Step 1: Leaf 2 (#turn-2, idx 1) at 2500ms, zIndex 20 at 3000ms
    // Step 2: Leaf 1 (#turn-1, idx 0) at 2700ms, zIndex 30 at 3200ms
    const pageTimers: NodeJS.Timeout[] = [];
    [2, 1, 0].forEach((pageIdx, step) => {
      const delay = (step + 1) * 200 + 2100;
      const t = setTimeout(() => {
        playPageFlipSound('backward');
        setPagesTurned((prev) => {
          const next = [...prev] as [boolean, boolean, boolean];
          next[pageIdx] = false;
          return next;
        });

        const tz = setTimeout(() => {
          setPageZIndices((prev) => {
            const next = [...prev] as [number, number, number];
            next[pageIdx] = 10 + (2 - pageIdx) * 10;
            return next;
          });
          if (step === 2) {
            setIsOpening(false);
          }
        }, 500);
        pageTimers.push(tz);
      }, delay);
      pageTimers.push(t);
    });

    return () => {
      clearTimeout(tCover);
      clearTimeout(tCoverDrop);
      pageTimers.forEach(clearTimeout);
    };
  };

  useEffect(() => {
    const cleanup = runOpeningSequence();
    return cleanup;
  }, []);

  // =========================================================================
  // NEXT / PREV BUTTONS FROM REFERENCE script.js
  // =========================================================================

  // Turn Forward (clicking Next on .page-front)
  const handlePageTurnForward = (pageIndex: number) => {
    if (animatingPage !== null || isOpening) return;
    setAnimatingPage(pageIndex);
    playPageFlipSound('forward');

    setPagesTurned((prev) => {
      const next = [...prev] as [boolean, boolean, boolean];
      next[pageIndex] = true;
      return next;
    });

    // Elevated z-index during the 3D flip so the page passes smoothly
    setPageZIndices((prev) => {
      const next = [...prev] as [number, number, number];
      next[pageIndex] = 50;
      return next;
    });

    // Resting z-index on the left side: page 0 (20), page 1 (25), page 2 (30)
    setTimeout(() => {
      setPageZIndices((prev) => {
        const next = [...prev] as [number, number, number];
        next[pageIndex] = 20 + pageIndex * 5;
        return next;
      });
      setAnimatingPage(null);
    }, 500);
  };

  // Turn Backward (clicking Prev on .page-back)
  const handlePageTurnBackward = (pageIndex: number) => {
    if (animatingPage !== null || isOpening) return;
    setAnimatingPage(pageIndex);
    playPageFlipSound('backward');

    setPagesTurned((prev) => {
      const next = [...prev] as [boolean, boolean, boolean];
      next[pageIndex] = false;
      return next;
    });

    // Elevated z-index during the return flip
    setPageZIndices((prev) => {
      const next = [...prev] as [number, number, number];
      next[pageIndex] = 50;
      return next;
    });

    // Resting z-index on the right side: page 0 (30), page 1 (20), page 2 (10)
    setTimeout(() => {
      setPageZIndices((prev) => {
        const next = [...prev] as [number, number, number];
        next[pageIndex] = 10 + (2 - pageIndex) * 10;
        return next;
      });
      setAnimatingPage(null);
    }, 500);
  };

  // "Contact Me!" Button on Profile Page (from reference script.js):
  // Turns all leaves forward sequentially to land directly on Page 6
  const handleContactMeClick = () => {
    if (animatingPage !== null || isOpening) return;
    playContactMeRapidFlipSound();

    [0, 1, 2].forEach((pageIdx, step) => {
      setTimeout(() => {
        setPagesTurned((prev) => {
          const next = [...prev] as [boolean, boolean, boolean];
          next[pageIdx] = true;
          return next;
        });
        setPageZIndices((prev) => {
          const next = [...prev] as [number, number, number];
          next[pageIdx] = 50;
          return next;
        });

        setTimeout(() => {
          setPageZIndices((prev) => {
            const next = [...prev] as [number, number, number];
            next[pageIdx] = 20 + step * 5;
            return next;
          });
        }, 500);
      }, (step + 1) * 200 + 100);
    });
  };

  // Return to Profile (.back-profile on Page 6 from reference script.js):
  // Turns all leaves backward in reverse order to return to initial state
  const handleBackToProfile = () => {
    if (animatingPage !== null || isOpening) return;
    playPageFlipSound('backward');

    [2, 1, 0].forEach((pageIdx, step) => {
      setTimeout(() => {
        playPageFlipSound('backward');
        setPagesTurned((prev) => {
          const next = [...prev] as [boolean, boolean, boolean];
          next[pageIdx] = false;
          return next;
        });
        setPageZIndices((prev) => {
          const next = [...prev] as [number, number, number];
          next[pageIdx] = 50;
          return next;
        });

        setTimeout(() => {
          setPageZIndices((prev) => {
            const next = [...prev] as [number, number, number];
            next[pageIdx] = 10 + (2 - pageIdx) * 10;
            return next;
          });
        }, 500);
      }, (step + 1) * 200 + 100);
    });
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isResumeOpen || selectedProject) return;
      if (e.key === 'ArrowRight') {
        const nextIdx = pagesTurned.findIndex((t) => !t);
        if (nextIdx !== -1) {
          handlePageTurnForward(nextIdx);
        }
      } else if (e.key === 'ArrowLeft') {
        let prevIdx = -1;
        for (let i = pagesTurned.length - 1; i >= 0; i--) {
          if (pagesTurned[i]) {
            prevIdx = i;
            break;
          }
        }
        if (prevIdx !== -1) {
          handlePageTurnBackward(prevIdx);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pagesTurned, isResumeOpen, selectedProject]);

  // Audio toggle
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundActive(newState);
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  // Form submit handler — send the contact form through EmailJS
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formSubmitting) return;

    setFormSubmitting(true);
    setFormSubmitted(false);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_ymsgsy9j',
          template_id: 'template_hw839p2',
          user_id: 'CwNc9T_1kQF3015Zw',
          template_params: {
            from_name: formData.name.trim(),
            from_email: formData.email.trim(),
            message: formData.message.trim(),
          },
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(errorDetails || 'EmailJS could not send the message.');
      }

      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      window.setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error('Contact form submission failed:', error);
      window.alert(
        'Your message could not be sent. Please try again or email gurukishore1208@gmail.com directly.'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Spread indicator
  const getCurrentVisibleSpread = () => {
    if (!pagesTurned[0]) return 'Profile & Page 1';
    if (!pagesTurned[1]) return 'Page 2 & Page 3';
    if (!pagesTurned[2]) return 'Page 4 & Page 5';
    return 'Page 6 (Contact Me)';
  };

  return (
    <div className="min-h-screen bg-[#0b1219] flex flex-col items-center justify-center p-3 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00abf0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#005a82]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Utility Header */}
      <header className="z-40 w-full max-w-4xl px-4 py-2 mb-1 flex items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl text-slate-300 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00abf0] flex items-center justify-center text-white font-bold">
            <i className="bx bx-book-bookmark text-sm"></i>
          </div>
          <span className="font-bold text-white tracking-wide text-sm">Gurukishore T</span>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline-block text-sky-400 font-medium">3D Flip-Book Portfolio</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block text-slate-400 font-medium">
            Spread: <span className="text-white font-semibold">{getCurrentVisibleSpread()}</span>
          </span>

          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <button
              onClick={() => {
                if (pagesTurned.some(Boolean)) handleBackToProfile();
              }}
              title="Return to Page 1"
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                !pagesTurned[0] ? 'bg-[#00abf0] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cover
            </button>
            <button
              onClick={() => {
                if (!pagesTurned[0]) handlePageTurnForward(0);
                if (pagesTurned[1]) handlePageTurnBackward(1);
                if (pagesTurned[2]) handlePageTurnBackward(2);
              }}
              title="Jump to Skills"
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                pagesTurned[0] && !pagesTurned[1] ? 'bg-[#00abf0] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => {
                if (!pagesTurned[0]) handlePageTurnForward(0);
                if (!pagesTurned[1]) handlePageTurnForward(1);
                if (pagesTurned[2]) handlePageTurnBackward(2);
              }}
              title="Jump to Projects"
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                pagesTurned[1] && !pagesTurned[2] ? 'bg-[#00abf0] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Projects
            </button>
            <button
              onClick={handleContactMeClick}
              title="Jump to Contact"
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                pagesTurned[2] ? 'bg-[#00abf0] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Contact
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runOpeningSequence}
            title="Replay Opening Transition"
            className="px-2 py-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <i className="bx bx-play-circle text-sm"></i>
            <span className="hidden sm:inline">Replay</span>
          </button>
          <button
            onClick={handleToggleSound}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              soundActive
                ? 'bg-sky-500/20 text-[#00abf0] border border-sky-500/40'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'
            }`}
            title={soundActive ? 'Sound Effects ON' : 'Sound Effects Muted'}
            aria-label="Toggle sound effects"
          >
            <i className={`bx ${soundActive ? 'bx-volume-full' : 'bx-volume-mute'} text-base`}></i>
          </button>
          <button
            onClick={() => setIsResumeOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-semibold transition-colors"
          >
            <i className="bx bxs-file-pdf"></i>
            CV
          </button>
        </div>
      </header>

      {/* Main 3D Open Notebook with Desk Surface Shadow */}
      <main
        className="bench-environment transition-transform duration-300"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="bench-surface-shadow" />

        <div ref={wrapperRef} className="wrapper">
          {/* Hardcover Outer Shell: Left and Right Covers from reference */}
          <div className="cover cover-left" />
          <div
            className={`cover cover-right ${coverTurned ? 'turn' : ''}`}
            style={{ zIndex: coverZIndex }}
          />

          <div className="book">
            {/* Center Spine Crease for authentic depth */}
            <div className="book-spine-crease" />

            {/* ============================================================== */}
            {/* INSIDE LEFT PAGE: Permanently visible profile page             */}
            {/* ============================================================== */}
            <div className="book-page page-left">
              <div className="profile-page">
                {/* Circular Portrait with glowing cyan accent */}
                <div className="avatar-container group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6-ugD694pqkL5-CE4QYuLfX8Okn4m9zdo9GjBv_KXONZ6-9ez-eV_SpJE1xYESLCJuJNKnZqwy3aO3QQmWYPuL0GFaNDkbVVF4FP3sk00PDPy5nuKXzPx3RQcu1wLXm1X8patOI1BBIFE4fc-MEWp7vA4kkKQVHUqK0qXqqLDyAeEVwpgCKlrgaYkLtfBHLoKbC4lGk7vbEns2iZ4XwMlrbyUKgBeHBgdxivC7Rpf-HJfEgq8IWb2ru_dhuEA5EJyirM"
                    alt="Gurukishore T"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="%230d1d2b"/><circle cx="80" cy="62" r="32" fill="%2300abf0"/><path d="M28 140 C28 108 52 98 80 98 C108 98 132 108 132 140 Z" fill="%2300abf0"/><text x="80" y="70" font-family="sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">GK</text></svg>';
                    }}
                  />
                </div>

                <h1>Gurukishore T</h1>
                <h3>Full-Stack Developer &amp; Cybersecurity Enthusiast</h3>

                {/* Social media links */}
                <div className="social-media">
                  <a
                    href="https://github.com/Gurukishore01"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub: Gurukishore01"
                  >
                    <i className="bx bxl-github"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/gurukishore1208/"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn: gurukishore1208"
                  >
                    <i className="bx bxl-linkedin"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/_guru_kishore_/"
                    target="_blank"
                    rel="noreferrer"
                    title="Instagram: _guru_kishore_"
                  >
                    <i className="bx bxl-instagram"></i>
                  </a>
                </div>

                <p>
                  Aspiring software engineer eager to build robust full-stack applications and secure digital
                  architectures. Passionate about turning complex logic into sleek, accessible web experiences.
                </p>

                {/* Action buttons */}
                <div className="btn-box">
                  <button onClick={() => setIsResumeOpen(true)} className="btn btn-outline">
                    Download CV
                  </button>
                  <button onClick={handleContactMeClick} className="btn contact-me">
                    Contact Me!
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* LEAF 1 (#turn-1): Front = Page 1 (Education), Back = Page 2 (Certifications) */}
            {/* ============================================================== */}
            <div
              className={`book-page page-right ${pagesTurned[0] ? 'turn' : ''} ${
                animatingPage === 0 ? 'flipping' : ''
              }`}
              id="turn-1"
              style={{
                zIndex: pageZIndices[0],
              }}
            >
              {/* PAGE 1: Education */}
              <div className="page-front">
                <h1 className="title">Education</h1>

                <div className="workeduc-box">
                  <div className="workeduc-content">
                    <span className="year">
                      <i className="bx bxs-graduation"></i> Pursuing
                    </span>
                    <h3>Paavai Engineering College (Autonomous)</h3>
                    <p>B.E. in Cybersecurity</p>
                    <span className="badge">CGPA: 8.22 / 10.0</span>
                  </div>

                  <div className="workeduc-content">
                    <span className="year">
                      <i className="bx bxs-calendar"></i> 2020 - 2022
                    </span>
                    <h3>K.V.S Matric Higher Secondary School</h3>
                    <p>Higher Secondary Certificate (HSC)</p>
                    <span className="badge">Score: 80%</span>
                  </div>

                  <div className="workeduc-content">
                    <span className="year">
                      <i className="bx bxs-calendar"></i> 2019 - 2020
                    </span>
                    <h3>Srividya Higher Secondary School</h3>
                    <p>Secondary School Leaving Certificate (SSLC)</p>
                    <span className="badge">Score: 81%</span>
                  </div>
                </div>

                <span className="number-page">1</span>

                <span
                  className="nextprev-btn"
                  onClick={() => handlePageTurnForward(0)}
                  title="Next Page"
                  role="button"
                  tabIndex={0}
                >
                  <i className="bx bx-chevron-right"></i>
                </span>
              </div>

              {/* PAGE 2: Certifications */}
              <div className="page-back">
                <h1 className="title">Certifications</h1>

                <div className="workeduc-box">
                  <div className="workeduc-content">
                    <span className="year">
                      <i className="bx bxs-badge-check"></i> Revamp Academy
                    </span>
                    <h3>Full Stack Java Development</h3>
                    <p>
                      Enterprise-level Java application development, relational database design, and modern web
                      architectures.
                    </p>
                  </div>

                  <div className="workeduc-content">
                    <span className="year">
                      <i className="bx bxs-shield-plus"></i> The Red Users
                    </span>
                    <h3>Cyber Security Certification</h3>
                    <p>
                      Hands-on penetration testing, ethical hacking toolsets, vulnerability assessment, and threat
                      mitigation.
                    </p>
                  </div>

                  <div className="workeduc-content">
                    <span className="year">
                      <i className="bx bxs-award"></i> IIT / NPTEL
                    </span>
                    <h3>NPTEL Certifications</h3>
                    <p>Cloud Computing Fundamentals &amp; Introduction to Internet of Things (IoT).</p>
                  </div>
                </div>

                <span className="number-page">2</span>

                <span
                  className="nextprev-btn back"
                  onClick={() => handlePageTurnBackward(0)}
                  title="Previous Page"
                  role="button"
                  tabIndex={0}
                >
                  <i className="bx bx-chevron-left"></i>
                </span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* LEAF 2 (#turn-2): Front = Page 3 (Skills), Back = Page 4 (Featured Projects) */}
            {/* ============================================================== */}
            <div
              className={`book-page page-right ${pagesTurned[1] ? 'turn' : ''} ${
                animatingPage === 1 ? 'flipping' : ''
              }`}
              id="turn-2"
              style={{
                zIndex: pageZIndices[1],
              }}
            >
              {/* PAGE 3: Technical Skills */}
              <div className="page-front">
                <h1 className="title">Technical Skills</h1>

                <div className="skills-box">
                  <div className="skills-section">
                    <h3>
                      <i className="bx bx-code-curly"></i> Languages &amp; Core
                    </h3>
                    <div className="skills-content-grid">
                      <span className="skill-badge">
                        <i className="bx bxl-java"></i> Java
                      </span>
                      <span className="skill-badge">
                        <i className="bx bxl-python"></i> Python
                      </span>
                      <span className="skill-badge">
                        <i className="bx bxl-javascript"></i> JavaScript
                      </span>
                      <span className="skill-badge">
                        <i className="bx bxl-html5"></i> HTML5
                      </span>
                      <span className="skill-badge">
                        <i className="bx bxl-css3"></i> CSS3
                      </span>
                    </div>
                  </div>

                  <div className="skills-section">
                    <h3>
                      <i className="bx bx-layer"></i> Frameworks &amp; Tools
                    </h3>
                    <div className="skills-content-grid">
                      <span className="skill-badge">
                        <i className="bx bxl-react"></i> React
                      </span>
                      <span className="skill-badge">
                        <i className="bx bxl-nodejs"></i> Node.js
                      </span>
                      <span className="skill-badge">
                        <i className="bx bxl-git"></i> Git &amp; GitHub
                      </span>
                      <span className="skill-badge">
                        <i className="bx bxl-bootstrap"></i> Bootstrap
                      </span>
                    </div>
                  </div>

                  <div className="skills-section">
                    <h3>
                      <i className="bx bx-shield-quarter"></i> Core Domains
                    </h3>
                    <div className="skills-content-grid">
                      <span className="skill-badge">
                        <i className="bx bx-devices"></i> Full-Stack Dev
                      </span>
                      <span className="skill-badge">
                        <i className="bx bx-terminal"></i> Ethical Hacking
                      </span>
                      <span className="skill-badge">
                        <i className="bx bx-network-chart"></i> Network Security
                      </span>
                    </div>
                  </div>
                </div>

                <span className="number-page">3</span>

                <span
                  className="nextprev-btn"
                  onClick={() => handlePageTurnForward(1)}
                  title="Next Page"
                  role="button"
                  tabIndex={0}
                >
                  <i className="bx bx-chevron-right"></i>
                </span>
              </div>

              {/* PAGE 4: Featured Projects */}
              <div className="page-back">
                <h1 className="title">Featured Projects</h1>

                <div className="projects-container">
                  <div
                    className="project-card cursor-pointer group"
                    onClick={() => setSelectedProject(PROJECTS.keyshield)}
                  >
                    <div className="proj-header">
                      <h3 className="group-hover:text-[#00abf0] transition-colors flex items-center gap-1.5">
                        KeyShield
                        <i className="bx bx-link-external text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[#00abf0]"></i>
                      </h3>
                      <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-bold">
                        Details
                      </span>
                    </div>
                    <span className="tech-tag">Java • Cryptography • Web Security</span>
                    <p>
                      Locker-based fake account prevention using unique key authentication &amp; encrypted validation
                      to eliminate duplicate spam accounts.
                    </p>
                  </div>

                  <div
                    className="project-card cursor-pointer group"
                    onClick={() => setSelectedProject(PROJECTS.safetrace)}
                  >
                    <div className="proj-header">
                      <h3 className="group-hover:text-[#00abf0] transition-colors flex items-center gap-1.5">
                        SafeTrace
                        <i className="bx bx-link-external text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[#00abf0]"></i>
                      </h3>
                      <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-bold">
                        Details
                      </span>
                    </div>
                    <span className="tech-tag">JavaScript • Full-Stack • AI Chatbot</span>
                    <p>
                      Digital footprint analyzer providing automated breach risk scoring, visual footprint metrics,
                      and personalized privacy recommendations.
                    </p>
                  </div>

                  <div
                    className="project-card cursor-pointer group"
                    onClick={() => setSelectedProject(PROJECTS.socialdefense)}
                  >
                    <div className="proj-header">
                      <h3 className="group-hover:text-[#00abf0] transition-colors flex items-center gap-1.5">
                        Social Engineering Defense
                        <i className="bx bx-link-external text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[#00abf0]"></i>
                      </h3>
                      <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-bold">
                        Details
                      </span>
                    </div>
                    <span className="tech-tag">Research • Attack Simulation • Security</span>
                    <p>
                      Empirical defense analysis modeling psychological exploit vectors to train users against deceptive
                      social engineering incursions.
                    </p>
                  </div>
                </div>

                <span className="number-page">4</span>

                <span
                  className="nextprev-btn back"
                  onClick={() => handlePageTurnBackward(1)}
                  title="Previous Page"
                  role="button"
                  tabIndex={0}
                >
                  <i className="bx bx-chevron-left"></i>
                </span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* LEAF 3 (#turn-3): Front = Page 5 (Pitch), Back = Page 6 (Contact Me!) */}
            {/* ============================================================== */}
            <div
              className={`book-page page-right ${pagesTurned[2] ? 'turn' : ''} ${
                animatingPage === 2 ? 'flipping' : ''
              }`}
              id="turn-3"
              style={{
                zIndex: pageZIndices[2],
              }}
            >
              {/* PAGE 5: Let's Build Together / CTA */}
              <div className="page-front">
                <h1 className="title">Let's Build Together</h1>

                <div className="cta-card">
                  <div className="cta-icon-circle">
                    <i className="bx bx-rocket"></i>
                  </div>
                  <h2>Looking to build a custom web app or secure architecture?</h2>
                  <p className="description">
                    Whether you need a dynamic full-stack web application, responsive modern UI, or security audit,
                    I help bring your ideas to life with clean code and robust architecture.
                  </p>

                  <button
                    className="btn next-cta-btn"
                    onClick={() => handlePageTurnForward(2)}
                    style={{ width: '100%', marginTop: '0.2rem' }}
                  >
                    Hire Me / Get in Touch{' '}
                    <i className="bx bx-right-arrow-alt" style={{ marginLeft: '0.4rem', fontSize: '1.2rem' }}></i>
                  </button>

                  <div className="cta-hint">
                    <i className="bx bx-info-circle"></i>
                    <span>Direct contact details &amp; message form are on the next page!</span>
                  </div>
                </div>

                <span className="number-page">5</span>

                <span
                  className="nextprev-btn"
                  onClick={() => handlePageTurnForward(2)}
                  title="Next Page"
                  role="button"
                  tabIndex={0}
                >
                  <i className="bx bx-chevron-right"></i>
                </span>
              </div>

              {/* PAGE 6: Contact Me! Form & Details */}
              <div className="page-back">
                <h1 className="title">Contact Me!</h1>

                <div className="contact-box">
                  <form onSubmit={handleFormSubmit} className="contact-form">
                    <input
                      type="text"
                      className="field"
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="email"
                      className="field"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <textarea
                      className="field"
                      placeholder="Project Details / Your Message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                    <button type="submit" disabled={formSubmitting} className="btn btn-submit">
                      {formSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>

                  {formSubmitted && (
                    <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-[11px] flex items-center gap-1.5 animate-in fade-in">
                      <i className="bx bx-check-circle text-emerald-600 text-sm"></i>
                      <span>Thank you! Gurukishore will get back to you shortly.</span>
                    </div>
                  )}

                  <div className="contact-details">
                    <div className="contact-detail-item">
                      <i className="bx bx-envelope"></i>
                      <a href="mailto:gurukishore1208@gmail.com">gurukishore1208@gmail.com</a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('gurukishore1208@gmail.com', 'email')}
                        className="ml-auto text-[10px] text-sky-600 hover:text-sky-800 font-bold px-1.5 py-0.5 rounded bg-sky-100/70"
                      >
                        {copiedItem === 'email' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="contact-detail-item">
                      <i className="bx bx-phone-call"></i>
                      <a href="tel:+916369977183">+91-6369977183</a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('+916369977183', 'phone')}
                        className="ml-auto text-[10px] text-sky-600 hover:text-sky-800 font-bold px-1.5 py-0.5 rounded bg-sky-100/70"
                      >
                        {copiedItem === 'phone' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="contact-detail-item">
                      <i className="bx bx-map-pin"></i>
                      <span>Tamil Nadu, India</span>
                    </div>
                  </div>
                </div>

                <span className="number-page">6</span>

                <span
                  className="nextprev-btn back"
                  onClick={() => handlePageTurnBackward(2)}
                  title="Previous Page"
                  role="button"
                  tabIndex={0}
                >
                  <i className="bx bx-chevron-left"></i>
                </span>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToProfile();
                  }}
                  className="back-profile"
                  title="Return to Profile"
                >
                  <p>Profile</p>
                  <i className="bx bxs-user"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation Hints */}
      <footer className="z-30 mt-1 flex items-center gap-3 text-slate-400 text-xs">
        <span className="hidden sm:inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">
            ←
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">
            →
          </kbd>
          <span>Use arrow keys to flip</span>
        </span>
        <span className="hidden sm:inline">·</span>
        <button
          onClick={() => {
            let prevIdx = -1;
            for (let i = pagesTurned.length - 1; i >= 0; i--) {
              if (pagesTurned[i]) {
                prevIdx = i;
                break;
              }
            }
            if (prevIdx !== -1) {
              handlePageTurnBackward(prevIdx);
            }
          }}
          disabled={!pagesTurned.some(Boolean)}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:hover:bg-slate-800/80 rounded border border-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
        >
          <i className="bx bx-chevron-left text-sm"></i>
          <span>Prev Page</span>
        </button>
        <button
          onClick={() => {
            const nextIdx = pagesTurned.findIndex((t) => !t);
            if (nextIdx !== -1) {
              handlePageTurnForward(nextIdx);
            }
          }}
          disabled={pagesTurned.every(Boolean)}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:hover:bg-slate-800/80 rounded border border-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
        >
          <span>Next Page</span>
          <i className="bx bx-chevron-right text-sm"></i>
        </button>
      </footer>

      {/* CV Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

      {/* Project Details Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
