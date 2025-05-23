import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';

const FileUploader = ({ onClose, onUpload, currentFolder }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    
    // In a real application, you would upload files to a server here
    // For this example, we'll simulate a delay and then call onUpload
    setTimeout(() => {
      onUpload(files);
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-surface-900/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Files</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
          Current folder: <span className="font-medium">{currentFolder === 'root' ? 'All Files' : currentFolder}</span>
        </p>
        
        <div {...getRootProps()} className="file-upload-zone mb-4">
          <input {...getInputProps()} />
          <ApperIcon name="Upload" className="h-10 w-10 text-surface-400 mb-3" />
          {isDragActive ? (
            <p className="text-primary font-medium">Drop the files here</p>
          ) : (
            <>
              <p className="font-medium mb-1">Drag & drop files here, or click to select files</p>
              <p className="text-sm text-surface-500">Supports images, documents, videos, and audio files</p>
            </>
          )}
        </div>
        
        {files.length > 0 && (
          <div className="mb-4 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b border-surface-200 dark:border-surface-700">
                <span className="truncate">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-red-500 p-1">
                  <ApperIcon name="X" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 rounded-lg">Cancel</button>
          <button 
            onClick={handleUpload} 
            disabled={files.length === 0 || uploading}
            className={`px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center space-x-2 ${
              (files.length === 0 || uploading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Upload" className="h-4 w-4" />
                <span>Upload {files.length} {files.length === 1 ? 'file' : 'files'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;