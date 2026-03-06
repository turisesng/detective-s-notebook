import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Loader } from 'lucide-react';

interface ImageUploadInputProps {
  currentImageUrl?: string | null;
  onImageSelected: (file: File) => void;
  onImageRemove?: () => void;
  isLoading?: boolean;
  error?: string;
  label?: string;
}

const ImageUploadInput = ({
  currentImageUrl,
  onImageSelected,
  onImageRemove,
  isLoading = false,
  error,
  label = 'Upload Image',
}: ImageUploadInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove?.();
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      
      <div className="space-y-2">
        {displayUrl ? (
<div className="relative w-full min-h-[450px] rounded-lg border-2 border-border overflow-hidden bg-secondary noir-glow flex items-center justify-center">            {/* The Image - Now using the large forensic class */}
            <img
              src={displayUrl}
              alt="Evidence Preview"
              className="evidence-image-large" 
            />
            
            {/* The Action Overlay - Visible on Hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </button>
              
              {onImageRemove && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="p-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-15 h-15" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full p-12 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Click to upload forensic image</span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />

        {error && (
          <div className="flex gap-2 items-start p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadInput;