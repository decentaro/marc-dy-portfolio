import React from 'react';

interface Skill {
  category: string;
  items: string[];
}

interface AboutSectionProps {
  skills: Skill[];
}

const AboutSection: React.FC<AboutSectionProps> = ({ skills }) => {
  return (
    <section id="about" className="py-20 px-4 bg-gray-900/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* About Me Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Me</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-8"></div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">My Journey</h3>
                <p className="text-gray-300 leading-relaxed">
                  I&apos;m a driven software developer who enjoys developing new solutions. I have experience developing and deploying apps that currently serve dozens of people and I enjoy the challenge of transforming a complicated problem into a simple, elegant piece of program.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">What Drives Me</h3>
                <p className="text-gray-300 leading-relaxed">
                  I specialize in full-stack development and enjoy working on projects that challenge me to learn and grow. When I&apos;m not coding, you&apos;ll find me gaming or tinkering with new technologies. This passion for gaming often inspires my personal projects, leading me to create practical tools for my community.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Long-term Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ultimately, I enjoy the process of bringing ideas to life, whether for a professional application or a unique vision. My goal is to keep honing my skills on challenging projects, with the long-term dream of one day building software that can support causes I&apos;m passionate about, like animal welfare.
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400 mb-1">4+</div>
                  <div className="text-xs text-gray-300">Projects</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400 mb-1">2+</div>
                  <div className="text-xs text-gray-300">Live Apps</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-xl border border-purple-500/30">
                  <div className="text-2xl font-bold text-purple-400 mb-1">50+</div>
                  <div className="text-xs text-gray-300">Active Users</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl border border-yellow-500/30">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">3+</div>
                  <div className="text-xs text-gray-300">Years Coding</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">Tech Stack</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>
            
            <div className="space-y-4">
              {skills.map((skillGroup, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <h4 className="text-white font-semibold mb-3">
                    {skillGroup.category}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {skillGroup.items.map((skill, i) => (
                      <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full hover:bg-white/20 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;