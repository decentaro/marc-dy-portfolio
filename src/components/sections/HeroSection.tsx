import React from 'react';
import { ArrowRight, Download } from 'lucide-react';

interface User {
  name: string;
  title: string;
  bio: string;
}

interface HeroSectionProps {
  user: User;
}

const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background elements - the animated gradient comes from body in globals.css */}
      <div className="absolute inset-0">
      </div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2">
              Hi, I&apos;m <span className="text-cyan-400">{user.name}</span>
            </h1>
            <h2 className="text-2xl md:text-4xl mb-8 text-gray-300 font-light">
              <p className="text-xl md:text-2xl text-gray-300 mb-6">{user.title}</p>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            {user.bio}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="#projects" 
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              View My Work <ArrowRight className="inline-block ml-2" size={20} />
            </a>
            <a 
              href="/assets/resume.pdf" 
              download
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                <Download size={20} />
                Download Resume
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;