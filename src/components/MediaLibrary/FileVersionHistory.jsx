import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';

const FileVersionHistory = ({ file, onClose }) => {
  const [selectedVersion, setSelectedVersion] = useState(file.versions[file.versions.length - 1].id);

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Restore a previous version (in a real app, this would restore the selected version)
  const handleRestoreVersion = () => {
    toast.success('Version restored successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-surface-900/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Version History: {file.name}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            {file.versions.length} version{file.versions.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden mb-4">
          <table className="w-full">
            <thead className="bg-surface-100 dark:bg-surface-700">
              <tr>
                <th className="px-4 py-2 text-left">Version</th>
                <th className="px-4 py-2 text-left">Date Modified</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {file.versions.map((version, index) => (
                <tr 
                  key={version.id} 
                  className={`border-t border-surface-200 dark:border-surface-700 ${
                    selectedVersion === version.id ? 'bg-primary/10 dark:bg-primary/20' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="version"
                        checked={selectedVersion === version.id}
                        onChange={() => setSelectedVersion(version.id)}
                        className="mr-2"
                      />
                      {index === file.versions.length - 1 ? 'Current' : `Version ${file.versions.length - index}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatDate(version.date)}</td>
                  <td className="px-4 py-3">{formatFileSize(version.size)}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      className="text-primary hover:text-primary-dark"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 rounded-lg">
            Close
          </button>
          <button 
            onClick={handleRestoreVersion}
            disabled={selectedVersion === file.versions[file.versions.length - 1].id}
            className={`px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg ${
              selectedVersion === file.versions[file.versions.length - 1].id ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Restore Selected Version
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileVersionHistory;