import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Sample website projects data
  const [projects, setProjects] = useState([
    {
      id: 'project-1',
      name: 'My Portfolio',
      lastModified: '2023-10-15T14:30:00Z',
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'project-2',
      name: 'Coffee Shop',
      lastModified: '2023-10-10T09:15:00Z',
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ]);

  // Create a new project
  const handleCreateProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: 'New Website',
      lastModified: new Date().toISOString(),
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };
    
    setProjects([newProject, ...projects]);
    setActiveProject(newProject.id);
    setShowWelcome(false);
  };
  
  // Format date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle clicking on a project
  const handleProjectClick = (projectId) => {
    setActiveProject(projectId);
    setShowWelcome(false);
  };
  
  // Go back to the dashboard
  const handleBackToDashboard = () => {
    setActiveProject(null);
    setShowWelcome(true);
  };

  return (
    <div>
      {showWelcome && !activeProject && (
        <>
          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Welcome to CanvasSite</h1>
              <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                Create stunning websites without writing a single line of code using our intuitive drag-and-drop builder.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button 
                onClick={handleCreateProject}
                className="mt-4 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors flex items-center mx-auto"
              >
                <ApperIcon name="Plus" className="mr-2 h-5 w-5" />
                Create New Website
              </button>
            </motion.div>
          </div>
          
          {/* Project Dashboard */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Websites</h2>
              <button 
                onClick={handleCreateProject}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center text-sm"
              >
                <ApperIcon name="Plus" className="mr-1.5 h-4 w-4" />
                New Website
              </button>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
                <ApperIcon name="FileX" className="h-12 w-12 mx-auto text-surface-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No websites yet</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  Create your first website to get started.
                </p>
                <button 
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  Create New Website
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -5 }}
                    className="card overflow-hidden cursor-pointer"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        }`}>
                          {project.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 truncate">{project.name}</h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        Last modified: {formatDate(project.lastModified)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Create new website card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="card flex flex-col items-center justify-center h-64 cursor-pointer border-2 border-dashed"
                  onClick={handleCreateProject}
                >
                  <ApperIcon name="Plus" className="h-12 w-12 text-primary mb-4" />
                  <span className="font-medium">Create New Website</span>
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Features Section */}
          <div className="mt-16 mb-10">
            <h2 className="text-2xl font-bold mb-8 text-center">Powerful Features for Your Website</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <ApperIcon name="MousePointerClick" className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Drag & Drop Builder</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Build your website visually by dragging and dropping elements exactly where you want them.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <ApperIcon name="Palette" className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Custom Styling</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Customize fonts, colors, and layouts to match your brand and create a unique look.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <ApperIcon name="Rocket" className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">One-Click Publishing</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Preview your changes in real-time and publish your website with a single click.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Website Builder */}
      {activeProject && (
        <div>
          <div className="mb-4">
            <button
              onClick={handleBackToDashboard}
              className="px-3 py-1.5 flex items-center text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-1.5" />
              Back to Dashboard
            </button>
          </div>
          
          <MainFeature />
        </div>
      )}
    </div>
  );
};

export default Home;