import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApperIcon from './components/ApperIcon';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import MediaLibrary from './components/MediaLibrary/MediaLibraryComponent';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 shadow-sm dark:shadow-none border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="LayoutTemplate" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">CanvasSite</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {location.pathname === '/media-library' && (
              <button 
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center space-x-1"
                aria-label="Back to Dashboard"
              >
                <ApperIcon name="ArrowLeft" className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={() => window.location.href = '/media-library'}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              aria-label="Media Library"
            >
              <ApperIcon name="Image" className="h-5 w-5" />
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <ApperIcon name="Sun" className="h-5 w-5" />
              ) : (
                <ApperIcon name="Moon" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/media-library" element={<MediaLibrary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto py-6 bg-surface-100 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-sm text-surface-600 dark:text-surface-400">
          <p>&copy; {new Date().getFullYear()} CanvasSite. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;