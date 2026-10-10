import React from 'react';

export interface ProjectData {
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  keyFeatures: string[];
  techStack: string[];
  githubUrl?: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white text-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-sky-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#00abf0] to-[#005a82] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
              <i className="bx bx-code-alt"></i>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{project.title}</h2>
              <p className="text-xs text-sky-100">{project.subtitle}</p>
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

        {/* Body */}
        <div className="p-6 space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-1">
              Project Overview
            </h3>
            <p className="text-slate-600">{project.description}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-1.5">
              Key Capabilities &amp; Architecture
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {project.keyFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <i className="bx bx-check text-sky-500 font-bold text-base mt-0.5"></i>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-2">
              Technologies Utilized
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <i className="bx bxl-github text-base"></i>
              View Repository
            </a>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
