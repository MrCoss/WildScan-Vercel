import { Mail, Linkedin, Github, Cpu, Monitor, Feather } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-brand-green-dark dark:text-brand-green-light">
          About WildScan
        </h1>
        <p className="mb-4">
          WildScan is a full-stack web application designed to identify animals from images. It leverages a powerful deep learning model served by a FastAPI backend and a modern, responsive user interface built with React and Tailwind CSS.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Technology Stack</h2>
        <ul className="list-inside space-y-2">
          <li className="flex items-center gap-2">
            <Monitor size={18} className="text-brand-green-dark dark:text-brand-green-light" />
            <span><strong>Frontend:</strong> React, Vite, TypeScript, Tailwind CSS, Framer Motion</span>
          </li>
          <li className="flex items-center gap-2">
            <Cpu size={18} className="text-brand-green-dark dark:text-brand-green-light" />
            <span><strong>Backend:</strong> FastAPI (Python)</span>
          </li>
          <li className="flex items-center gap-2">
            <Feather size={18} className="text-brand-green-dark dark:text-brand-green-light" />
            <span><strong>Machine Learning:</strong> PyTorch</span>
          </li>
        </ul>

        <p className="mt-6 text-sm text-gray-500">
          This application was created to demonstrate the integration of a trained machine learning model into a real-world, user-friendly web service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Developer / Contact</h2>
        <ul className="list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <Feather size={18} className="text-brand-green-dark dark:text-brand-green-light" />
            <span><strong>Name:</strong> Costas Pinto</span>
          </li>
          <li className="flex items-center gap-2">
            <Mail size={18} className="text-brand-green-dark dark:text-brand-green-light" />
            <a href="mailto:costaspinto312@gmail.com" className="underline">
              costaspinto312@gmail.com
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Linkedin size={18} className="text-brand-green-dark dark:text-brand-green-light" />
            <a href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="underline">
              linkedin.com/in/costaspinto
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Github size={18} className="text-brand-green-dark dark:text-brand-green-light" />
            <a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="underline">
              github.com/MrCoss
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
