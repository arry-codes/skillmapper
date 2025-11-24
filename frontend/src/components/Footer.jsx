import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'; // Optional icons

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm">
            © {new Date().getFullYear()} <span className="text-white font-semibold">SkillMap</span>. All rights reserved.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Replace `#` with actual links if needed */}
          <a href="#" className="hover:text-white transition-colors duration-300 text-sm">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors duration-300 text-sm">
            Terms of Service
          </a>
        </div>

        {/* Optional: Social Media Icons */}
        <div className="flex gap-5 text-xl">
          <a href="https://github.com/arry-codes" className="hover:text-white transition-colors duration-300">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/kashyap-aryan/" className="hover:text-white transition-colors duration-300">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
