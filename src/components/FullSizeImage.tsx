import { useState } from "react";
import { Button } from "./ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface FullSizeImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export const FullSizeImage = ({ src, alt, className = "" }: FullSizeImageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative group ${isExpanded ? 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center' : ''}`}>
      {isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
        >
          <Minimize2 className="h-6 w-6" />
        </Button>
      )}
      
      <img 
        src={src} 
        alt={alt || "Post content"} 
        className={`${
          isExpanded 
            ? 'max-w-[90vw] max-h-[90vh] object-contain rounded-lg' 
            : 'w-full h-auto object-contain max-h-none cursor-pointer transition-transform hover:scale-105'
        } ${className}`}
        onClick={() => setIsExpanded(!isExpanded)}
        onError={(e) => {
          console.error('Error loading image:', e);
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {!isExpanded && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setIsExpanded(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {isExpanded && (
        <div 
          className="absolute inset-0" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}; 