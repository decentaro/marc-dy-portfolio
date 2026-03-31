"use client";

import React, { useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export interface CADProject {
  id: number;
  title: string;
  description: string;
  images: string[];
  hdImages: string[];
  category: string;
}

interface CADSectionProps {
  cadProjects: CADProject[];
  selectedCADImage: { projectId: number | null; imageIndex: number };
  setSelectedCADImage: (selection: { projectId: number | null; imageIndex: number }) => void;
  lightboxImage: { src: string; title: string; index: number; projectId: number } | null;
  setLightboxImage: (image: { src: string; title: string; index: number; projectId: number } | null) => void;
}

const CADSection: React.FC<CADSectionProps> = ({
  cadProjects,
  selectedCADImage,
  setSelectedCADImage,
  lightboxImage,
  setLightboxImage
}) => {
  const currentProject = lightboxImage ? cadProjects.find(p => p.title === lightboxImage.title) : null;

  const containerRef = useRef<HTMLDivElement>(null);

  // Create intersection observers for each project
  const observer1 = useIntersectionObserver({ threshold: 0.1, rootMargin: '100px', triggerOnce: true });
  const observer2 = useIntersectionObserver({ threshold: 0.1, rootMargin: '100px', triggerOnce: true });
  const observer3 = useIntersectionObserver({ threshold: 0.1, rootMargin: '100px', triggerOnce: true });
  const observers = [observer1, observer2, observer3];
  
  const navigateLightboxImage = useCallback((direction: 'next' | 'prev') => {
    if (!currentProject || !lightboxImage) return;
    
    const currentIndex = lightboxImage.index;
    const totalImages = currentProject.images.length;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    }
    
    setLightboxImage({
      ...lightboxImage,
      index: newIndex,
      src: currentProject.hdImages[newIndex]
    });
  }, [currentProject, lightboxImage, setLightboxImage]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxImage) return;
      
      if (e.key === 'ArrowLeft') {
        navigateLightboxImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightboxImage('next');
      } else if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxImage, navigateLightboxImage, setLightboxImage]);

  return (
    <>
      <section id="cad" className="py-24 px-4 border-t border-slate-700/40 min-h-screen" style={{ background: '#0f172a' }}>
        <div className="max-w-5xl mx-auto">

          {/* Header — left aligned like contact */}
          <div className="mb-16">
            <p className="text-cyan-400 font-mono text-sm mb-3 tracking-widest uppercase">CAD</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">3D Design & Engineering</h2>
            <p className="text-slate-400 text-lg">Custom enclosures and mechanical parts designed in Fusion 360.</p>
          </div>

          <div ref={containerRef} className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {cadProjects.map((project, index) => {
              const { targetRef, shouldLoad } = observers[index];
              const activeIndex = selectedCADImage.projectId === project.id ? selectedCADImage.imageIndex : 0;

              return (
                <div
                  key={project.id}
                  ref={targetRef}
                  className="group flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/60 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  {/* Image area */}
                  <div
                    className="relative h-56 overflow-hidden cursor-pointer bg-slate-800"
                    onClick={() => setLightboxImage({
                      src: project.hdImages[activeIndex],
                      title: project.title,
                      index: activeIndex,
                      projectId: project.id
                    })}
                  >
                    {shouldLoad ? (
                      <Image
                        src={project.images[activeIndex]}
                        alt={project.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VLIAAAA"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={85}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <span className="text-slate-600 text-sm font-mono">{project.title}</span>
                      </div>
                    )}

                    {/* Expand hint on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-mono bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        click to expand
                      </span>
                    </div>

                    {/* Thumbnail strip — overlaid at bottom of image */}
                    {project.images.length > 1 && shouldLoad && (
                      <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 px-3 pb-3 pt-8 bg-linear-to-t from-black/70 to-transparent">
                        {project.images.map((image, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCADImage({ projectId: project.id, imageIndex: i });
                            }}
                            className={`relative w-10 h-8 rounded overflow-hidden border transition-all duration-200 shrink-0 ${
                              activeIndex === i
                                ? 'border-cyan-400 opacity-100 scale-105'
                                : 'border-white/20 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${project.title} ${i + 1}`}
                              width={40}
                              height={32}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              sizes="40px"
                              quality={60}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-white leading-snug">{project.title}</h3>
                      <span className="shrink-0 text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <p className="text-slate-600 text-xs font-mono mt-auto">
                      {project.images.length} image{project.images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAD Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors z-20 shadow-lg"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Navigation arrows for multiple images */}
            {currentProject && currentProject.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightboxImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateLightboxImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main lightbox image */}
            <Image
              src={lightboxImage.src}
              alt={`${lightboxImage.title} - Full size`}
              width={1920}
              height={1440}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={() => setLightboxImage(null)}
              priority
              sizes="(max-width: 768px) 100vw, 90vw"
              quality={90}
            />
            
            {/* Navigation hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-xs text-white text-sm px-3 py-2 rounded-lg opacity-60">
              {currentProject && currentProject.images.length > 1 
                ? 'Use ← → keys or click arrows to navigate • Click anywhere to close'
                : 'Click anywhere to close'
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CADSection;