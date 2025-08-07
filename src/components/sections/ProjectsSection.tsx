import React from 'react';
import ProjectCard, { Project } from '../ui/ProjectCard';

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
  setExpandedProject
}) => {
  const filterOptions = ['All', 'Web Application', 'Discord Bot', 'Hardware'];
  
  const filteredProjects = selectedFilter === 'All' 
    ? projects 
    : projects.filter(project => project.type === selectedFilter);

  const displayedProjects = filteredProjects;

  return (
    <section id="projects" className="py-20 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Featured Projects</h2>
          <p className="text-gray-300 text-xl">Some of my recent work</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8 flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 auto-rows-fr">
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              expandedProject={expandedProject}
              setExpandedProject={setExpandedProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;