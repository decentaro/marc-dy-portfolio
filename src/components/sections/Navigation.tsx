import React from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  userName: string;
}

const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  setActiveSection,
  isMenuOpen,
  setIsMenuOpen,
  userName
}) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'cad', label: 'CAD' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a 
              href="#home"
              onClick={() => setActiveSection('home')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="/icon.png"
                alt="Marc Dy Logo"
                width={56}
                height={56}
                className="rounded-lg"
              />
            </a>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-cyan-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-gray-900/90 backdrop-blur-md rounded-lg mt-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;