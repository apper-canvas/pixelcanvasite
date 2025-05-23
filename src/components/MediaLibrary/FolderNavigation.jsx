import { useState } from 'react';
import ApperIcon from '../ApperIcon';

const FolderNavigation = ({ folders, currentFolder, onFolderSelect, onCreateFolder }) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(['root']);

  // Get immediate children of a folder
  const getFolderChildren = (folderId) => {
    return folders.filter(folder => folder.parentId === folderId);
  };

  // Toggle folder expansion
  const toggleFolderExpansion = (folderId) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId) 
        : [...prev, folderId]
    );
  };

  // Handle creating a new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  // Render a folder and its children recursively
  const renderFolder = (folder, depth = 0) => {
    const children = getFolderChildren(folder.id);
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = currentFolder === folder.id;
    
    return (
      <div key={folder.id} className="mb-1">
        <div 
          className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
            isSelected 
              ? 'bg-primary text-white' 
              : 'hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
          style={{ paddingLeft: `${(depth * 12) + 12}px` }}
          onClick={() => onFolderSelect(folder.id)}
        >
          {children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolderExpansion(folder.id);
              }}
              className="mr-1"
            >
              <ApperIcon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} className="h-4 w-4" />
            </button>
          )}
          <ApperIcon name="Folder" className={`h-5 w-5 mr-2 ${isSelected ? 'text-white' : 'text-surface-500'}`} />
          <span className="text-sm truncate">{folder.name}</span>
        </div>
        
        {isExpanded && children.map(child => renderFolder(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-sm uppercase tracking-wider text-surface-500">Folders</h3>
          <button 
            onClick={() => setIsCreatingFolder(true)}
            className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
            title="Create new folder"
          >
            <ApperIcon name="FolderPlus" className="h-5 w-5" />
          </button>
        </div>
        
        {/* New folder input */}
        {isCreatingFolder && (
          <div className="flex mb-4">
            <input
              type="text"
              className="input-field flex-1 py-1.5 text-sm"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
            <button 
              onClick={handleCreateFolder}
              className="p-1.5 bg-primary text-white rounded-r-lg"
            >
              <ApperIcon name="Check" className="h-4 w-4" />
            </button>
            <button 
              onClick={() => {
                setIsCreatingFolder(false);
                setNewFolderName('');
              }}
              className="p-1.5 bg-surface-200 dark:bg-surface-700 rounded-r-lg ml-1"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Folder tree */}
        <div className="space-y-1">
          {folders
            .filter(folder => folder.parentId === null)
            .map(folder => renderFolder(folder))}
        </div>
      </div>
    </div>
  );
};

export default FolderNavigation;