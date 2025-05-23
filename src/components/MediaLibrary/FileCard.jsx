import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';

const FileCard = ({ file, viewMode, onDelete, onEdit, onVersionHistory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get appropriate icon for file type
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType === 'application/pdf') return 'FileText';
    if (fileType.includes('document') || fileType.includes('text/')) return 'File';
    if (fileType.startsWith('video/')) return 'Video';
    if (fileType.startsWith('audio/')) return 'Music';
    return 'File';
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Copy file URL to clipboard
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(file.url);
    toast.success('URL copied to clipboard');
    setIsMenuOpen(false);
  };
  
  // Handle deleting a file
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  // Confirm file deletion
  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    setIsMenuOpen(false);
  };
  
  if (viewMode === 'grid') {
    return (
      <div className="media-card relative group">
        {/* File thumbnail or icon */}
        <div className="aspect-square bg-surface-100 dark:bg-surface-700 relative">
          {file.thumbnailUrl ? (
            <img
              src={file.thumbnailUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ApperIcon name={getFileIcon(file.type)} className="h-12 w-12 text-surface-400" />
            </div>
          )}
          
          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-surface-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-white rounded-full hover:bg-surface-100"
              title="Edit"
            >
              <ApperIcon name="Edit2" className="h-4 w-4 text-surface-800" />
            </button>
            <button
              onClick={copyUrlToClipboard}
              className="p-2 bg-white rounded-full hover:bg-surface-100"
              title="Copy URL"
            >
              <ApperIcon name="Link" className="h-4 w-4 text-surface-800" />
            </button>
            <button
              onClick={onVersionHistory}
              className="p-2 bg-white rounded-full hover:bg-surface-100"
              title="Version History"
            >
              <ApperIcon name="History" className="h-4 w-4 text-surface-800" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white rounded-full hover:bg-surface-100"
              title="Delete"
            >
              <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
        
        {/* File info */}
        <div className="p-3">
          <h3 className="font-medium text-sm truncate" title={file.name}>{file.name}</h3>
          <div className="flex justify-between items-center mt-1 text-xs text-surface-500">
            <span>{formatFileSize(file.size)}</span>
            <span>{formatDate(file.lastModified)}</span>
          </div>
        </div>
        
        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-surface-900/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-surface-800 p-4 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-2">Delete File</h3>
              <p className="mb-4">Are you sure you want to delete "{file.name}"? This action cannot be undone.</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 rounded-lg">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default FileCard;