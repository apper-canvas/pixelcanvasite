import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';

const ImageEditor = ({ file, onClose, onSave }) => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState('none');
  const [zoom, setZoom] = useState(1);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [activeTab, setActiveTab] = useState('crop');
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Load the image
  useEffect(() => {
    const img = new Image();
    img.src = file.url;
    img.onload = () => {
      setImage(img);
    };
  }, [file.url]);
  
  // Initialize crop area
  useEffect(() => {
    if (image) {
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          16 / 9,
          image.width,
          image.height
        ),
        image.width,
        image.height
      );
      setCrop(crop);
    }
  }, [image]);
  
  // Generate the edited image
  const generateImage = async () => {
    if (!completedCrop || !canvasRef.current || !imgRef.current) {
      toast.error('Please complete the crop first');
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create a temporary canvas for rotation and filtering
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set temp canvas dimensions to handle rotation
    const maxSize = Math.max(imgRef.current.width, imgRef.current.height);
    tempCanvas.width = maxSize * 2;
    tempCanvas.height = maxSize * 2;
    
    // Translate to center of temp canvas
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
    
    // Draw the image on temp canvas
    tempCtx.drawImage(
      imgRef.current,
      tempCanvas.width / 2 - imgRef.current.width / 2,
      tempCanvas.height / 2 - imgRef.current.height / 2
    );
    
    // Apply filters
    if (filter !== 'none') {
      tempCtx.filter = getFilterStyle(filter);
    }
    
    // Draw the temp canvas onto the main canvas with cropping
    ctx.drawImage(
      tempCanvas,
      tempCanvas.width / 2 - imgRef.current.width / 2 + completedCrop.x,
      tempCanvas.height / 2 - imgRef.current.height / 2 + completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Failed to generate image');
        return;
      }
      
      // Compress the image
      try {
        const compressedFile = await imageCompression(blob, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920
        });
        
        onSave(file.id, compressedFile);
      } catch (error) {
        console.error('Image compression error:', error);
        onSave(file.id, blob);
      }
    });
  };
  
  // Get CSS filter style for selected filter
  const getFilterStyle = (filter) => {
    switch (filter) {
      case 'grayscale':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(100%)';
      case 'invert':
        return 'invert(100%)';
      case 'blur':
        return 'blur(5px)';
      case 'brightness':
        return 'brightness(150%)';
      case 'contrast':
        return 'contrast(150%)';
      default:
        return 'none';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-surface-900/80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Image: {file.name}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('crop')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'crop' ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700'}`}
          >
            Crop & Rotate
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'filter' ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700'}`}
          >
            Filters
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden bg-surface-100 dark:bg-surface-900 rounded-lg mb-4 flex items-center justify-center">
          {image && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={activeTab === 'crop' ? undefined : crop.aspect}
              style={{ 
                filter: filter !== 'none' ? getFilterStyle(filter) : undefined,
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                maxHeight: '60vh'
              }}
            >
              <img
                ref={imgRef}
                src={file.url}
                alt="Edit preview"
                style={{ maxHeight: '60vh' }}
              />
            </ReactCrop>
          )}
          
          {/* Hidden canvas for image processing */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </div>
        
        {activeTab === 'crop' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rotation</label>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setRotation(prev => prev - 90)}
                  className="p-2 bg-surface-200 dark:bg-surface-700 rounded-lg"
                >
                  <ApperIcon name="RotateCcw" className="h-5 w-5" />
                </button>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="flex-1"
                />
                <button 
                  onClick={() => setRotation(prev => prev + 90)}
                  className="p-2 bg-surface-200 dark:bg-surface-700 rounded-lg"
                >
                  <ApperIcon name="RotateCw" className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Zoom</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'filter' && (
          <div>
            <label className="block text-sm font-medium mb-2">Filters</label>
            <div className="grid grid-cols-4 gap-2">
              {['none', 'grayscale', 'sepia', 'invert', 'blur', 'brightness', 'contrast'].map(filterOption => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`p-2 rounded-lg text-center capitalize ${
                    filter === filterOption 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-200 dark:bg-surface-700'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={generateImage}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;