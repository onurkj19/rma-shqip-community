import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt?: string;
}

export const ImageModal = ({ isOpen, onClose, imageSrc, alt }: ImageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-6 w-6" />
        </Button>
        
        <img
          src={imageSrc}
          alt={alt || "Post image"}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
    </div>
  );
}; 