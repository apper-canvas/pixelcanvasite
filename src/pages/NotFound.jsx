import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4"
    >
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center">
            <ApperIcon name="FileQuestion" className="h-12 w-12 text-surface-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors"
        >
          <ApperIcon name="Home" className="mr-2 h-5 w-5" />
          Return Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;