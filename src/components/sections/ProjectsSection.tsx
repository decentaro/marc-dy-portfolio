"use client";

import React, { useRef, useEffect, useState } from 'react';
import ProjectCard, { Project } from '../ui/ProjectCard';
import { useProjectMeasurements } from '../../hooks/useProjectLayout';

interface ProjectsSectionProps {
  projects: Project[];
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  expandedProject: number | null;
  setExpandedProject: (id: number | null) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  selectedFilter,
  setSelectedFilter,
  expandedProject,
  setExpandedProject,
}) => {
  const filterOptions = ['All', 'Web Application', 'Desktop Application', 'CLI Tool', 'Discord Bot', 'Hardware'];
  const filteredProjects = selectedFilter === 'All'
    ? projects
    : projects.filter((p) => p.type === selectedFilter);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const columns = containerWidth >= 768 ? 2 : 1;

  // Pretext measures exact card heights
  const measurements = useProjectMeasurements(filteredProjects, containerWidth, columns);

  // Pair cards into rows, each row's cards get the height of the taller one
  // so every row is perfectly level — no misaligned last row
  const rows: Array<{ projects: Project[]; rowHeight: number }> = [];
  for (let i = 0; i < filteredProjects.length; i += columns) {
    const rowProjects = filteredProjects.slice(i, i + columns);
    const rowHeight = rowProjects.reduce((max, p) => {
      const m = measurements.get(p.id);
      if (!m) return max;
      const h = expandedProject === p.id ? m.expandedHeight : m.collapsedHeight;
      return Math.max(max, h);
    }, 0);
    rows.push({ projects: rowProjects, rowHeight });
  }

  return (
    <section id="projects" className="py-20 px-4 min-h-screen" style={{ background: '#0f172a' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Featured Projects</h2>
          <p className="text-slate-400 text-xl">Some of my recent work</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-10 flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid — row by row, each card in a row gets the same Pretext-measured height */}
        <div ref={containerRef} className="flex flex-col gap-8">
          {rows.map((row, ri) => (
            <div key={ri} className="flex flex-col sm:flex-row gap-8">
              {row.projects.map((project) => (
                <div
                  key={project.id}
                  className="flex-1"
                  style={{
                    height: row.rowHeight > 0 ? `${row.rowHeight}px` : undefined,
                    transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <ProjectCard
                    project={project}
                    expandedProject={expandedProject}
                    setExpandedProject={setExpandedProject}
                  />
                </div>
              ))}
              {/* Fill empty slot in last row if odd number of projects */}
              {row.projects.length < columns && (
                <div className="flex-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
