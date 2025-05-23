import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import ApperIcon from '../ApperIcon';
import FileCard from './FileCard';
import FolderNavigation from './FolderNavigation';
import FileUploader from './FileUploader';
import ImageEditor from './ImageEditor';
import FileVersionHistory from './FileVersionHistory';

// Sample initial data for demonstration
const initialMediaFiles = [
  {
    id: '1',
    name: 'hero-image.jpg',
    type: 'image/jpeg',
    size: 1240000,
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200',
    folder: 'images',
    uploadDate: new Date('2023-04-15').toISOString(),
    lastModified: new Date('2023-04-15').toISOString(),
    versions: [
      { id: '1-1', date: new Date('2023-04-15').toISOString(), size: 1240000 }
    ],
    tags: ['hero', 'background']
  },
  {
    id: '2',
    name: 'profile.jpg',
    type: 'image/jpeg',
    size: 540000,
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    folder: 'images/profiles',
    uploadDate: new Date('2023-03-10').toISOString(),
    lastModified: new Date('2023-03-12').toISOString(),
    versions: [
      { id: '2-1', date: new Date('2023-03-10').toISOString(), size: 650000 },
      { id: '2-2', date: new Date('2023-03-12').toISOString(), size: 540000 }
    ],
    tags: ['profile', 'people']
  },
  {
    id: '3',
    name: 'brochure.pdf',
    type: 'application/pdf',
    size: 2500000,
    url: '#',
    thumbnailUrl: null,
    folder: 'documents',
    uploadDate: new Date('2023-05-20').toISOString(),
    lastModified: new Date('2023-05-20').toISOString(),
    versions: [
      { id: '3-1', date: new Date('2023-05-20').toISOString(), size: 2500000 }
    ],
    tags: ['brochure', 'marketing']
  },
  {
    id: '4',
    name: 'team.jpg',
    type: 'image/jpeg',
    size: 1840000,
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    folder: 'images/team',
    uploadDate: new Date('2023-02-05').toISOString(),
    lastModified: new Date('2023-02-05').toISOString(),
    versions: [
      { id: '4-1', date: new Date('2023-02-05').toISOString(), size: 1840000 }
    ],
    tags: ['team', 'people', 'office']
  }
];

const initialFolders = [
  { id: 'root', name: 'All Files', parentId: null },
  { id: 'images', name: 'Images', parentId: 'root' },
  { id: 'images/profiles', name: 'Profiles', parentId: 'images' },
  { id: 'images/team', name: 'Team', parentId: 'images' },
  { id: 'documents', name: 'Documents', parentId: 'root' }
];

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles);
  const [folders, setFolders] = useState(initialFolders);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Filter and sort files based on current folder, search query, and active tab
  useEffect(() => {
    let filtered = [...mediaFiles];
    
    // Filter by folder
    if (currentFolder !== 'root') {
      filtered = filtered.filter(file => file.folder === currentFolder);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(query) || 
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Filter by file type tab
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'images':
          filtered = filtered.filter(file => file.type.startsWith('image/'));
          break;
        case 'documents':
          filtered = filtered.filter(file => 
            file.type === 'application/pdf' || 
            file.type.includes('document') || 
            file.type.includes('text/')
          );
          break;
        case 'videos':
          filtered = filtered.filter(file => file.type.startsWith('video/'));
          break;
        case 'audio':
          filtered = filtered.filter(file => file.type.startsWith('audio/'));
          break;
        default:
          break;
      }
    }
    
    // Sort files
    filtered.sort((a, b) => {
      let compareResult = 0;
      
      switch (sortBy) {
        case 'name':
          compareResult = a.name.localeCompare(b.name);
          break;
        case 'size':
          compareResult = a.size - b.size;
          break;
        case 'date':
        default:
          compareResult = new Date(a.lastModified) - new Date(b.lastModified);
          break;
      }
      
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
    
    setFilteredFiles(filtered);
  }, [mediaFiles, currentFolder, searchQuery, activeTab, sortBy, sortOrder]);

  const handleFileUpload = (files) => {
    const newFiles = files.map(file => ({
      id: uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      folder: currentFolder,
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      versions: [
        { id: uuidv4(), date: new Date().toISOString(), size: file.size }
      ],
      tags: []
    }));
    
    setMediaFiles([...mediaFiles, ...newFiles]);
    setIsUploaderOpen(false);
    toast.success(`Successfully uploaded ${files.length} file${files.length !== 1 ? 's' : ''}`);
  };

  const handleCreateFolder = (folderName) => {
    if (!folderName.trim()) return;
    
    const newFolderId = currentFolder === 'root' 
      ? folderName.toLowerCase().replace(/\s+/g, '-') 
      : `${currentFolder}/${folderName.toLowerCase().replace(/\s+/g, '-')}`;
    
    const newFolder = {
      id: newFolderId,
      name: folderName,
      parentId: currentFolder
    };
    
    setFolders([...folders, newFolder]);
    toast.success(`Folder "${folderName}" created successfully`);
  };

  const handleDeleteFile = (fileId) => {
    setMediaFiles(mediaFiles.filter(file => file.id !== fileId));
    toast.success('File deleted successfully');
  };

  const handleSaveImage = (fileId, editedImageBlob) => {
    setMediaFiles(prevFiles => {
      return prevFiles.map(file => {
        if (file.id === fileId) {
          const newVersion = {
            id: uuidv4(),
            date: new Date().toISOString(),
            size: editedImageBlob.size
          };
          
          return {
            ...file,
            url: URL.createObjectURL(editedImageBlob),
            thumbnailUrl: URL.createObjectURL(editedImageBlob),
            size: editedImageBlob.size,
            lastModified: new Date().toISOString(),
            versions: [...file.versions, newVersion]
          };
        }
        return file;
      });
    });
    
    setIsImageEditorOpen(false);
    toast.success('Image edited and saved successfully');
  };

  return (
    <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl overflow-hidden shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
      <div className="bg-white dark:bg-surface-800 p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Library</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsUploaderOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center space-x-2"
          >
            <ApperIcon name="Upload" className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>
      
      <div className="flex h-[80vh]">
        {/* Folder Navigation Sidebar */}
        <FolderNavigation 
          folders={folders}
          currentFolder={currentFolder}
          onFolderSelect={setCurrentFolder}
          onCreateFolder={handleCreateFolder}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Media Library Toolbar */}
          <div className="media-toolbar">
            <div className="flex space-x-4">
              {['all', 'images', 'documents', 'videos', 'audio'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeTab === tab 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search files..."
                className="input-field w-64 py-1.5 px-3 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-1.5 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700"
                title="Toggle view"
              >
                <ApperIcon name={viewMode === 'grid' ? 'List' : 'Grid'} className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Files Display */}
          <div className="flex-1 p-4 overflow-y-auto">
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ApperIcon name="FileQuestion" className="h-16 w-16 text-surface-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No files found</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4 max-w-md">
                  {searchQuery 
                    ? `No files match your search "${searchQuery}". Try different keywords or clear your search.` 
                    : "This folder is empty. Upload files or create subfolders to organize your media."}
                </p>
                <button
                  onClick={() => setIsUploaderOpen(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
                >
                  Upload Files
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'media-grid' : 'space-y-2'}>
                {filteredFiles.map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    viewMode={viewMode}
                    onDelete={() => handleDeleteFile(file.id)}
                    onEdit={() => {
                      if (file.type.startsWith('image/')) {
                        setSelectedFile(file);
                        setIsImageEditorOpen(true);
                      } else {
                        toast.info('Editing is only available for images');
                      }
                    }}
                    onVersionHistory={() => {
                      setSelectedFile(file);
                      setIsVersionHistoryOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* File Uploader Modal */}
      {isUploaderOpen && (
        <FileUploader
          onClose={() => setIsUploaderOpen(false)}
          onUpload={handleFileUpload}
          currentFolder={currentFolder}
        />
      )}
      
      {/* Image Editor Modal */}
      {isImageEditorOpen && selectedFile && (
        <ImageEditor
          file={selectedFile}
          onClose={() => setIsImageEditorOpen(false)}
          onSave={handleSaveImage}
        />
      )}
      
      {/* Version History Modal */}
      {isVersionHistoryOpen && selectedFile && (
        <FileVersionHistory
          file={selectedFile}
          onClose={() => setIsVersionHistoryOpen(false)}
        />
      )}
    </div>
  );
};

export default MediaLibrary;