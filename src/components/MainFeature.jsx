import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SketchPicker } from 'react-color';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

// Sample website templates
const WEBSITE_TEMPLATES = [
  {
    id: 'template-1',
    name: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Professional template for businesses with services section and contact form.'
  },
  {
    id: 'template-2',
    name: 'Portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1545665277-5937489579f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Showcase your work with this elegant portfolio template.'
  },
  {
    id: 'template-3',
    name: 'Restaurant',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Perfect for restaurants with menu sections and reservation form.'
  },
  {
    id: 'template-4',
    name: 'Event',
    thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Ideal for promoting events with registration capabilities.'
  }
];

// Sample website sections that can be dragged
const WEBSITE_SECTIONS = [
  {
    id: 'header',
    name: 'Header',
    icon: 'HeaderIcon',
    type: 'structure'
  },
  {
    id: 'about',
    name: 'About',
    icon: 'Info',
    type: 'structure'
  },
  {
    id: 'services',
    name: 'Services',
    icon: 'Briefcase',
    type: 'structure'
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: 'Mail',
    type: 'structure'
  },
  {
    id: 'text',
    name: 'Text',
    icon: 'Type',
    type: 'element'
  },
  {
    id: 'image',
    name: 'Image',
    icon: 'Image',
    type: 'element'
  },
  {
    id: 'button',
    name: 'Button',
    icon: 'MousePointerClick',
    type: 'element'
  },
  {
    id: 'form',
    name: 'Form',
    icon: 'FormInput',
    type: 'element'
  }
];

// Placeholder for website data
const initialWebsiteData = {
  mediaLibrary: [],
  name: 'My New Website',
  sections: []
};

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('editor'); // editor, preview, templates, settings, styles
  const [websiteData, setWebsiteData] = useState(initialWebsiteData);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementStyles, setElementStyles] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const editorRef = useRef(null);
  const [colorScheme, setColorScheme] = useState('blue'); // blue, purple, green, orange

  // Sample color schemes
  const colorSchemes = {
    blue: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#2563eb'
    },
    purple: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#7c3aed'
    },
    green: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#059669'
    },
    orange: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#ea580c'
    }
  };

  // Default styling options
  const defaultElementStyle = {
    backgroundColor: 'transparent',
    textColor: '#000000',
    fontSize: '16px',
    fontWeight: 'normal',
    fontFamily: 'Inter',
    textAlign: 'left',
    padding: '16px',
    margin: '8px',
    borderWidth: '0px',
    borderColor: '#e2e8f0',
    borderRadius: '8px',
    boxShadow: 'none',
    animation: 'none'
  };

  // Handle dragging elements into the editor
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Add the dropped item to the website data
    setWebsiteData(prevData => {
      const newData = { 
        ...prevData,
        sections: [...prevData.sections, {
          ...itemData,
          id: `${itemData.id}-${Date.now()}`,
          content: getDefaultContentForType(itemData.id)
        }]
      };
      setHasChanges(true);
      return newData;
    });
    
    toast.success(`Added ${itemData.name} section to your website!`);
  };

  // Get default content based on element type
  const getDefaultContentForType = (type) => {
    // Handle regular element types
    switch(type) {
      case 'header':
        return { title: 'Welcome to My Website', subtitle: 'A great place to share your ideas' };
      case 'about':
        return { title: 'About Us', content: 'Write about your company or yourself here.' };
      case 'services':
        return { title: 'Our Services', items: [
          { title: 'Service 1', description: 'Description for service 1' },
          { title: 'Service 2', description: 'Description for service 2' },
          { title: 'Service 3', description: 'Description for service 3' }
        ]};
      case 'contact':
        return { title: 'Contact Us', email: 'contact@example.com', phone: '(123) 456-7890' };
      case 'text':
        return { content: 'Click to edit this text' };
      case 'image':
        return { src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', alt: 'Placeholder image' };
      case 'button':
        return { label: 'Click Me', url: '#' };
      case 'form':
        return { 
          title: 'Contact Form',
          fields: [
            { type: 'text', label: 'Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'textarea', label: 'Message', required: true }
          ]
        };
      default:
        return {};
    }
  };

  // Handle selecting an element in the editor
  const handleElementClick = (elementId) => {
    setSelectedElement(elementId);
  };

  // Handle removing an element
  const handleRemoveElement = (elementId) => {
    setWebsiteData(prevData => ({
      ...prevData,
      sections: prevData.sections.filter(section => section.id !== elementId)
    }));
    setSelectedElement(null);
    setHasChanges(true);
    toast.info('Section removed from your website');
  };
  
  // Open media library for selecting images
  const openMediaLibrarySelector = () => {
    // In a real implementation, this would show a modal with the media library
    // For this demo, we'll simulate adding a media library image
    const sampleMediaItem = {
      id: `media-${Date.now()}`,
      name: 'Sample Media Image',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      fromMediaLibrary: true
    };
    
    // Add the selected image to the website
    setWebsiteData(prevData => {
      const newData = { 
        ...prevData,
        sections: [...prevData.sections, {
          id: `image-${Date.now()}`,
          name: 'Image',
          icon: 'Image',
          type: 'element',
          content: { 
            src: sampleMediaItem.url, 
            alt: sampleMediaItem.name,
            fromMediaLibrary: true,
            mediaId: sampleMediaItem.id
          }
        }]
      };
      setHasChanges(true);
      return newData;
    });
    
    toast.success('Image added from Media Library!');
  };

  // Handle publishing the website
  const handlePublish = async () => {
    if (isPublishing) return;
    
    // Validate website has content
    if (websiteData.sections.length === 0) {
      toast.error('Cannot publish an empty website. Please add some content first.');
      return;
    }
    
    // Validate website has a name
    if (!websiteData.name || websiteData.name.trim() === '') {
      toast.error('Please provide a name for your website before publishing.');
      return;
    }
    
    setIsPublishing(true);
    toast.info('Publishing your website...');
    
    try {
      // Simulate publishing process with API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random publishing success/failure (90% success rate)
      if (Math.random() > 0.1) {
        // Generate a random subdomain for the published site
        const subdomain = websiteData.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.random().toString(36).substr(2, 4);
        const publishedUrl = `https://${subdomain}.canvassite.com`;
        
        toast.success(`Website published successfully! Visit: ${publishedUrl}`, {
          autoClose: 5000
        });
        setHasChanges(false);
      } else {
        throw new Error('Publishing service temporarily unavailable');
      }
    } catch (error) {
      toast.error(`Publishing failed: ${error.message}. Please try again.`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle saving the website
  const handleSave = () => {
    toast.success('Changes saved successfully!');
    setHasChanges(false);
  };

  // Handle selecting a template
  const handleSelectTemplate = (template) => {
    setWebsiteData({
      name: `My ${template.name} Website`,
      sections: [
        {
          id: `header-${Date.now()}`,
          name: 'Header',
          icon: 'HeaderIcon',
          type: 'structure',
          content: { title: `My ${template.name} Website`, subtitle: 'Welcome to my website' }
        },
        {
          id: `about-${Date.now()}`,
          name: 'About',
          icon: 'Info',
          type: 'structure',
          content: { title: 'About Us', content: 'Information about our business or service.' }
        },
        {
          id: `services-${Date.now()}`,
          name: 'Services',
          icon: 'Briefcase',
          type: 'structure',
          content: { 
            title: 'Our Services', 
            items: [
              { title: 'Service 1', description: 'Description for service 1' },
              { title: 'Service 2', description: 'Description for service 2' },
              { title: 'Service 3', description: 'Description for service 3' }
            ]
          }
        },
        {
          id: `contact-${Date.now()}`,
          name: 'Contact',
          icon: 'Mail',
          type: 'structure',
          content: { title: 'Contact Us', email: 'contact@example.com', phone: '(123) 456-7890' }
        }
      ]
    });
    setActiveTab('editor');
    toast.success(`${template.name} template applied!`);
    setHasChanges(true);
  };

  // Apply color scheme to website
  const handleApplyColorScheme = (scheme) => {
    setColorScheme(scheme);
    toast.success(`${scheme.charAt(0).toUpperCase() + scheme.slice(1)} color scheme applied!`);
    setHasChanges(true);
  };
  // Handle element styling
  const updateElementStyle = (elementId, styleProperty, value) => {
    setElementStyles(prev => ({
      ...prev,
      [elementId]: {
        ...(prev[elementId] || defaultElementStyle),
        [styleProperty]: value
      }
    }));
    setHasChanges(true);
    toast.success('Style updated successfully');
  };

  const resetElementStyles = (elementId) => {
    if (!elementId) {
      // Reset all styles
      setElementStyles({});
      toast.success('All element styles reset to default');
    } else {
      // Reset specific element
      setElementStyles(prev => {
        const updated = { ...prev };
        delete updated[elementId];
        return updated;
      });
      toast.success('Element styles reset to default');
    }
    setHasChanges(true);
  };

  const getElementStyle = (elementId) => {
    return elementStyles[elementId] || defaultElementStyle;
  };

  const applyStylesToElement = (elementId) => {
    const styles = getElementStyle(elementId);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.textColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      fontFamily: styles.fontFamily,
      textAlign: styles.textAlign,
      padding: styles.padding,
      margin: styles.margin,
      borderWidth: styles.borderWidth,
      borderColor: styles.borderColor,
      borderStyle: styles.borderWidth !== '0px' ? 'solid' : 'none',
      borderRadius: styles.borderRadius,
      boxShadow: styles.boxShadow,
      animation: styles.animation !== 'none' ? `${styles.animation} 2s infinite` : 'none'
    };
  };

  // Render styling panel
  const renderStylingPanel = () => {
    if (!selectedElement) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <ApperIcon name="Palette" className="h-16 w-16 text-surface-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Select an element to style</h3>
          <p className="text-surface-600 dark:text-surface-400">
            Click on any element in the editor to customize its appearance
          </p>
        </div>
      );
    }

    const currentStyles = getElementStyle(selectedElement);
    const selectedSection = websiteData.sections.find(s => s.id === selectedElement);

    return (
      <div className="p-6 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Styling: {selectedSection?.name}</h2>
          <button
            onClick={() => resetElementStyles(selectedElement)}
            className="text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
          >
            Reset Styles
          </button>
        </div>

        {/* Background Color */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">Background</h3>
          <label className="block text-sm font-medium mb-2">Background Color</label>
          <SketchPicker
            color={currentStyles.backgroundColor}
            onChange={(color) => updateElementStyle(selectedElement, 'backgroundColor', color.hex)}
            width="100%"
          />
        </div>

        {/* Typography */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">Typography</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <SketchPicker
                color={currentStyles.textColor}
                onChange={(color) => updateElementStyle(selectedElement, 'textColor', color.hex)}
                width="100%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <select 
                className="input-field"
                value={currentStyles.fontSize}
                onChange={(e) => updateElementStyle(selectedElement, 'fontSize', e.target.value)}
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
                <option value="48px">48px</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font Weight</label>
              <select 
                className="input-field"
                value={currentStyles.fontWeight}
                onChange={(e) => updateElementStyle(selectedElement, 'fontWeight', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Light</option>
                <option value="bolder">Extra Bold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text Align</label>
              <select 
                className="input-field"
                value={currentStyles.textAlign}
                onChange={(e) => updateElementStyle(selectedElement, 'textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">Spacing</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Padding</label>
              <select 
                className="input-field"
                value={currentStyles.padding}
                onChange={(e) => updateElementStyle(selectedElement, 'padding', e.target.value)}
              >
                <option value="0px">None</option>
                <option value="8px">Small</option>
                <option value="16px">Medium</option>
                <option value="24px">Large</option>
                <option value="32px">Extra Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Margin</label>
              <select 
                className="input-field"
                value={currentStyles.margin}
                onChange={(e) => updateElementStyle(selectedElement, 'margin', e.target.value)}
              >
                <option value="0px">None</option>
                <option value="8px">Small</option>
                <option value="16px">Medium</option>
                <option value="24px">Large</option>
                <option value="32px">Extra Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Borders */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">Borders</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Border Width</label>
              <select 
                className="input-field"
                value={currentStyles.borderWidth}
                onChange={(e) => updateElementStyle(selectedElement, 'borderWidth', e.target.value)}
              >
                <option value="0px">None</option>
                <option value="1px">Thin</option>
                <option value="2px">Medium</option>
                <option value="4px">Thick</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Border Color</label>
              <SketchPicker
                color={currentStyles.borderColor}
                onChange={(color) => updateElementStyle(selectedElement, 'borderColor', color.hex)}
                width="100%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Border Radius</label>
              <select 
                className="input-field"
                value={currentStyles.borderRadius}
                onChange={(e) => updateElementStyle(selectedElement, 'borderRadius', e.target.value)}
              >
                <option value="0px">None</option>
                <option value="4px">Small</option>
                <option value="8px">Medium</option>
                <option value="16px">Large</option>
                <option value="50%">Rounded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Effects */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">Effects</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Box Shadow</label>
              <select 
                className="input-field"
                value={currentStyles.boxShadow}
                onChange={(e) => updateElementStyle(selectedElement, 'boxShadow', e.target.value)}
              >
                <option value="none">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.1)">Light</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 25px rgba(0,0,0,0.15)">Heavy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Animation</label>
              <select 
                className="input-field"
                value={currentStyles.animation}
                onChange={(e) => updateElementStyle(selectedElement, 'animation', e.target.value)}
              >
                <option value="none">None</option>
                <option value="pulse">Pulse</option>
                <option value="bounce">Bounce</option>
                <option value="fade-in">Fade In</option>
                <option value="slide-in">Slide In</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">Global Actions</h3>
          <button
            onClick={() => {
              if (confirm('Reset all element styles? This action cannot be undone.')) {
                resetElementStyles();
              }
            }}
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Reset All Styles
          </button>
        </div>
      </div>
    );
  };

  // Render editor element
  const renderEditorElement = (section) => {
    const isSelected = selectedElement === section.id;
    
    const baseClasses = `editor-element relative mb-4 ${isSelected ? 'selected' : ''} 
                       border-2 border-dashed ${isSelected ? 'border-solid border-primary' : 'border-surface-300 dark:border-surface-600'}
                       rounded-lg transition-all duration-200`;
    
    
    return (
      <div 
        key={section.id} 
        className={baseClasses}
        onClick={() => handleElementClick(section.id)}
      >
        {/* Remove button (only visible when selected) */}
        {isSelected && (
          <button 
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveElement(section.id);
            }}
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </button>
        )}
        
        {/* Element content */}
        <div className="p-4 bg-white dark:bg-surface-800 rounded-md" style={applyStylesToElement(section.id)}>
          <div className="flex items-center mb-2">
            <ApperIcon name={section.icon} className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{section.name}</h3>
          </div>
          
          {section.id.startsWith('header') && (
            <div className="py-8 text-center">
              <h2 className="text-2xl font-bold mb-2">{section.content.title}</h2>
              <p className="text-surface-600 dark:text-surface-400">{section.content.subtitle}</p>
            </div>
          )}
          
          {section.id.startsWith('about') && (
            <div className="py-4">
              <h3 className="text-xl font-bold mb-2">{section.content.title}</h3>
              <p className="text-surface-600 dark:text-surface-400">{section.content.content}</p>
            </div>
          )}
          
          {section.id.startsWith('services') && (
            <div className="py-4">
              <h3 className="text-xl font-bold mb-4">{section.content.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.items.map((item, index) => (
                  <div key={index} className="p-3 border border-surface-200 dark:border-surface-700 rounded-lg">
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {section.id.startsWith('contact') && (
            <div className="py-4">
              <h3 className="text-xl font-bold mb-2">{section.content.title}</h3>
              <p className="mb-1">
                <span className="font-medium">Email:</span> {section.content.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {section.content.phone}
              </p>
            </div>
          )}
          
          {section.id.startsWith('text') && (
            <div className="py-2">
              <p>{section.content.content}</p>
            </div>
          )}
          
          {section.id.startsWith('image') && (
            <div className="py-2">
              <img 
                src={section.content.src}
                alt={section.content.alt}
                className="max-w-full h-auto rounded-lg"
              />
              {section.content.fromMediaLibrary && (
                <div className="mt-2 text-xs text-surface-500 italic flex items-center">
                  <ApperIcon name="Info" className="h-3 w-3 mr-1" />
                  From Media Library
                </div>
              )}
              <button 
                onClick={openMediaLibrarySelector}
                className="mt-2 text-sm text-primary hover:text-primary-dark flex items-center"
              >
                <ApperIcon name="RefreshCw" className="h-3 w-3 mr-1" />
                Replace from Media Library
              </button>
            </div>
          )}
          
          {section.id.startsWith('button') && (
            <div className="py-2">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                {section.content.label}
              </button>
            </div>
          )}
          
          {section.id.startsWith('form') && (
            <div className="py-2">
              <h3 className="font-bold mb-2">{section.content.title}</h3>
              <div className="space-y-3">
                {section.content.fields.map((field, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      {field.label}{field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea className="input-field h-24" placeholder={`Enter ${field.label.toLowerCase()}`} />
                    ) : (
                      <input 
                        type={field.type} 
                        className="input-field" 
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl overflow-hidden shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
      {/* Builder Header */}
      <div className="bg-white dark:bg-surface-800 p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{websiteData.name}</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {websiteData.sections.length} sections
            {hasChanges && " • Unsaved changes"}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.location.href = '/media-library'}
            className="px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
          >
            <ApperIcon name="Image" className="h-4 w-4" />
            <span>Media Library</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 ${
              hasChanges 
                ? 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600' 
                : 'bg-surface-100 dark:bg-surface-800 text-surface-400 cursor-not-allowed'
            }`}
          >
            <ApperIcon name="Save" className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 ${
              isPublishing ? 'bg-surface-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
            } text-white`}
          >
            <ApperIcon name={isPublishing ? "Loader2" : "Upload"} className={`h-4 w-4 ${isPublishing ? 'animate-spin' : ''}`} />
            <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>
      
      {/* Builder Tabs */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
        <div className="flex">
          {['editor', 'preview', 'templates', 'settings', 'styles'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Builder Content */}
      <div className="flex h-[70vh] bg-surface-50 dark:bg-surface-900">
        {/* Elements panel (visible only in editor mode) */}
        {activeTab === 'editor' && (
          <div className="w-64 border-r border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-sm uppercase tracking-wider text-surface-500 mb-3">Elements</h3>
              <div className="space-y-1">
                {WEBSITE_SECTIONS.map(item => (
                  <div 
                    key={item.id}
                    draggable
                    data-element-type={item.type}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center p-2 rounded-lg cursor-move transition-all duration-200 ${
                      isDragging ? 'opacity-50 scale-95' : 'hover:bg-surface-100 dark:hover:bg-surface-700 hover:shadow-sm'
                    }`}
                  >
                    <ApperIcon name={item.icon} className="h-5 w-5 mr-2 text-surface-600 dark:text-surface-400" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-sm uppercase tracking-wider text-surface-500 mb-3">Media Library</h3>
                <button
                  onClick={openMediaLibrarySelector}
                  className="w-full p-2 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 rounded-lg text-sm flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="Image" className="h-5 w-5" />
                  <span>Select from Media Library</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Templates panel */}
        {activeTab === 'templates' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Choose a Template</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Select a template to get started quickly with a pre-designed website layout.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {WEBSITE_TEMPLATES.map(template => (
                <motion.div
                  key={template.id}
                  whileHover={{ y: -5 }}
                  className="card overflow-hidden"
                >
                  <img 
                    src={template.thumbnail} 
                    alt={template.name} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{template.name}</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                      {template.description}
                    </p>
                    <button
                      onClick={() => handleSelectTemplate(template)}
                      className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm"
                    >
                      Use Template
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Settings panel */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Website Settings</h2>
            
            <div className="card p-4 mb-6">
              <h3 className="font-bold mb-3">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Website Name</label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={websiteData.name}
                    onChange={(e) => {
                      setWebsiteData({...websiteData, name: e.target.value});
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website Description</label>
                  <textarea 
                    className="input-field h-24"
                    placeholder="Enter a short description of your website"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="card p-4 mb-6">
              <h3 className="font-bold mb-3">Color Scheme</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.keys(colorSchemes).map(scheme => (
                  <button
                    key={scheme}
                    onClick={() => handleApplyColorScheme(scheme)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      colorScheme === scheme 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-surface-300 dark:hover:border-surface-600'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex space-x-1 mb-2">
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: colorSchemes[scheme].primary }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: colorSchemes[scheme].secondary }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded-full" 
                          style={{ backgroundColor: colorSchemes[scheme].accent }}
                        ></div>
                      </div>
                      <span className="text-sm capitalize">{scheme}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="font-bold mb-3">Typography</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Heading Font</label>
                  <select className="input-field">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Montserrat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body Font</label>
                  <select className="input-field">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Montserrat</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Editor canvas */}
        {/* Styles panel */}
        {activeTab === 'styles' && (
          <div className="flex-1 overflow-y-auto">
            {renderStylingPanel()}
          </div>
        )}
        
        {activeTab === 'editor' && (
          <div 
            ref={editorRef}
            className={`flex-1 p-6 bg-surface-100 dark:bg-surface-900 overflow-y-auto transition-all duration-200 ${
              isDragging ? 'bg-primary/5 border-2 border-dashed border-primary/30' : ''
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {websiteData.sections.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg">
                <ApperIcon name="LayoutTemplate" className="h-12 w-12 text-surface-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Your canvas is empty</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4 max-w-md">
                  Drag and drop elements from the left panel to start building your website, or choose a template to get started quickly.
                </p>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  Choose a Template
                </button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow-sm overflow-hidden">
                {websiteData.sections.map(renderEditorElement)}
              </div>
            )}
          </div>
        )}
        
        {/* Preview mode */}
        {activeTab === 'preview' && (
          <div className="flex-1 p-6 bg-surface-100 dark:bg-surface-900 overflow-y-auto">
            <div className="bg-white dark:bg-surface-800 max-w-4xl mx-auto rounded-lg shadow-sm overflow-hidden">
              {websiteData.sections.length === 0 ? (
                <div className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No content to preview</h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    Add some elements to your website first.
                  </p>
                </div>
              ) : (
                websiteData.sections.map(section => {
                  return (
                    <div key={section.id} className="preview-section p-4" style={applyStylesToElement(section.id)}>
                      {section.id.startsWith('header') && (
                        <div className="py-12 text-center" style={{backgroundColor: colorSchemes[colorScheme].primary, color: 'white'}}>
                          <h1 className="text-3xl md:text-4xl font-bold mb-4">{section.content.title}</h1>
                          <p className="text-lg opacity-90">{section.content.subtitle}</p>
                        </div>
                      )}
                      
                      {section.id.startsWith('about') && (
                        <div className="py-12 px-4">
                          <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{color: colorSchemes[colorScheme].primary}}>
                              {section.content.title}
                            </h2>
                            <p className="text-lg text-surface-700 dark:text-surface-300 leading-relaxed">
                              {section.content.content}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {section.id.startsWith('services') && (
                        <div className="py-12 px-4 bg-surface-50 dark:bg-surface-900">
                          <div className="max-w-5xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center" style={{color: colorSchemes[colorScheme].primary}}>
                              {section.content.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {section.content.items.map((item, index) => (
                                <div key={index} className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                                  <h3 className="text-xl font-bold mb-3" style={{color: colorSchemes[colorScheme].accent}}>
                                    {item.title}
                                  </h3>
                                  <p className="text-surface-600 dark:text-surface-400">
                                    {item.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.id.startsWith('contact') && (
                        <div className="py-12 px-4">
                          <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{color: colorSchemes[colorScheme].primary}}>
                              {section.content.title}
                            </h2>
                            <div className="flex flex-col md:flex-row justify-around items-center gap-8">
                              <div className="text-center">
                                <div 
                                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" 
                                  style={{backgroundColor: colorSchemes[colorScheme].secondary}}
                                >
                                  <ApperIcon name="Mail" className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-bold mb-2">Email</h3>
                                <p className="text-surface-600 dark:text-surface-400">{section.content.email}</p>
                              </div>
                              <div className="text-center">
                                <div 
                                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" 
                                  style={{backgroundColor: colorSchemes[colorScheme].secondary}}
                                >
                                  <ApperIcon name="Phone" className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-bold mb-2">Phone</h3>
                                <p className="text-surface-600 dark:text-surface-400">{section.content.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.id.startsWith('text') && (
                        <div className="py-4 px-4">
                          <div className="max-w-3xl mx-auto">
                            <p className="text-surface-800 dark:text-surface-200 leading-relaxed">
                              {section.content.content}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {section.id.startsWith('image') && (
                        <div className="py-4 px-4">
                          <div className="max-w-3xl mx-auto">
                            <img 
                              src={section.content.src} 
                              alt={section.content.alt} 
                              className="max-w-full h-auto rounded-lg mx-auto"
                            />
                            {section.content.fromMediaLibrary && (
                              <p className="text-xs text-center text-surface-500 mt-2 italic">
                                Image from Media Library
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {section.id.startsWith('button') && (
                        <div className="py-8 px-4 text-center">
                          <button 
                            className="px-6 py-3 rounded-lg text-white font-medium"
                            style={{backgroundColor: colorSchemes[colorScheme].primary}}
                          >
                            {section.content.label}
                          </button>
                        </div>
                      )}
                      
                      {section.id.startsWith('form') && (
                        <div className="py-12 px-4 bg-surface-50 dark:bg-surface-900">
                          <div className="max-w-2xl mx-auto bg-white dark:bg-surface-800 p-8 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 className="text-xl font-bold mb-6 text-center" style={{color: colorSchemes[colorScheme].primary}}>
                              {section.content.title}
                            </h3>
                            <div className="space-y-4">
                              {section.content.fields.map((field, index) => (
                                <div key={index} className="flex flex-col">
                                  <label className="mb-1 font-medium">
                                    {field.label}{field.required && <span className="text-red-500">*</span>}
                                  </label>
                                  {field.type === 'textarea' ? (
                                    <textarea className="input-field h-32" placeholder={`Enter ${field.label.toLowerCase()}`} />
                                  ) : (
                                    <input 
                                      type={field.type} 
                                      className="input-field" 
                                      placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                  )}
                                </div>
                              ))}
                              <button 
                                className="w-full py-3 text-white font-medium rounded-lg mt-4"
                                style={{backgroundColor: colorSchemes[colorScheme].primary}}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;