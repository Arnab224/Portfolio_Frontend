// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MatrixBackground from '../components/MatrixBackground';
import GridOverlay from '../components/GridOverlay';
import { PROJECT_API } from "../api/api";


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(PROJECT_API.GET_ALL);
      const data = await response.json();

      if (data.success) {
        // simulate delay for nicer loading effect
        setTimeout(() => {
          setProjects(data.data);
          setIsLoading(false);
        }, 1000); // 1 second delay
      } else {
        console.error('Error fetching projects:', data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setIsLoading(false);
    }
  };

  fetchProjects();
}, []);

  const categories = ['all', 'web', 'mobile', 'fullstack', 'other'];
  
  const filteredProjects = projects.filter(project => {
    const matchesCategory = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => 
                           tech.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 min-h-screen relative cyber-grid">
      <MatrixBackground />
      <GridOverlay />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 font-mono"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gray-400">~/</span>
            <span className="terminal-text">projects</span>
          </h1>
          <p className="text-gray-400 text-lg">
            $ ls -la | grep &quot;active&quot; → Found {filteredProjects.length} projects
          </p>
        </motion.div>

        {/* Filter and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-black border border-green-500/30 rounded-lg p-6 font-mono mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">projects_terminal — active</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search */}
              <div>
                <label className="block text-green-400 text-sm mb-2">
                  $ SEARCH_PROJECTS =
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="grep -r &quot;technology&quot; ./"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-green-500/30 text-green-400 px-4 py-3 rounded focus:outline-none focus:border-green-500 focus:glow-primary font-mono placeholder-gray-600"
                  />
                  <div className="absolute right-3 top-3 text-gray-400 text-sm">
                    🔍
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div>
                <label className="block text-blue-400 text-sm mb-2">
                  $ FILTER_CATEGORY =
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`px-4 py-2 rounded border text-sm transition-all duration-300 font-mono ${
                        filter === category
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 glow-secondary'
                          : 'bg-black text-gray-400 border-gray-600 hover:border-blue-500/30 hover:text-blue-400'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-500/20">
              <div className="text-sm text-gray-400">
                <span className="text-green-400">{filteredProjects.length}</span> projects matched
              </div>
              <div className="text-sm text-gray-400">
                Status: <span className="text-green-400">ACTIVE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 font-mono bg-black border border-blue-500/30 rounded-lg"
          >
            <div className="text-gray-400 text-lg mb-4">
              $ loading_projects.sh --status=in_progress
            </div>
            <div className="text-blue-400 text-sm animate-pulse">
              Compiling project data...
            </div>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-black border border-green-500/30 rounded-lg overflow-hidden group hover:border-green-500/50 transition-all duration-300 cosmic-glow"
              >
                {/* Project Header */}
                <div className="p-6 border-b border-green-500/20 bg-black/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-green-400 font-mono text-lg group-hover:glow-primary transition-all duration-300">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30 rounded font-mono">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm font-mono leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="p-6 border-b border-green-500/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-blue-400 text-sm font-mono">$ TECH_STACK</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="p-6 border-b border-green-500/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-purple-400 text-sm font-mono">$ KEY_FEATURES</span>
                  </div>
                  <div className="space-y-2">
                    {project.achievements.slice(0, 2).map((achievement, idx) => (
                      <div key={idx} className="text-gray-400 text-sm font-mono flex items-start">
                        <span className="text-green-500 mr-2 mt-1">▶</span>
                        <span className="flex-1">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-500/50 px-4 py-3 rounded text-sm font-mono transition-all duration-300 hover:glow-primary"
                    >
                      view code
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 px-4 py-3 rounded text-sm font-mono transition-all duration-300 hover:glow-secondary"
                    >
                      live demo
                    </a>
                  )}
                </div>

                {/* Project Footer */}
                <div className="px-6 py-3 bg-black/50 border-t border-green-500/20">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono">
                      {project.category} • {project.year || 'Recent'}
                    </span>
                    <span className="font-mono">
                      {project.technologies.length} techs
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 font-mono bg-black border border-red-500/30 rounded-lg"
          >
            <div className="text-gray-400 text-lg mb-4">
              $ echo &quot;No projects found&quot; && sleep 2
            </div>
            <div className="text-red-400 text-sm mb-4">
              ERROR: No projects match the current search criteria.
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setFilter('all')}
                className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 hover:border-green-500 px-4 py-2 rounded font-mono text-sm transition-all duration-300 hover:glow-primary"
              >
                $ ./reset_filters.sh
              </button>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:border-blue-500 px-4 py-2 rounded font-mono text-sm transition-all duration-300 hover:glow-secondary"
              >
                $ ./clear_search.sh
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer Stats */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-black border border-gray-500/30 rounded-lg p-6 font-mono"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="text-green-400">
                <div className="text-2xl font-bold">{filteredProjects.length}</div>
                <div className="text-xs text-gray-400">PROJECTS</div>
              </div>
              <div className="text-blue-400">
                <div className="text-2xl font-bold">
                  {new Set(filteredProjects.flatMap(p => p.technologies)).size}
                </div>
                <div className="text-xs text-gray-400">TECHNOLOGIES</div>
              </div>
              <div className="text-purple-400">
                <div className="text-2xl font-bold">
                  {filteredProjects.filter(p => p.featured).length}
                </div>
                <div className="text-xs text-gray-400">FEATURED</div>
              </div>
              <div className="text-yellow-400">
                <div className="text-2xl font-bold">
                  {categories.length}
                </div>
                <div className="text-xs text-gray-400">CATEGORIES</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;