import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadZoneProps {
  label: string;
  sublabel: string;
  image: string | null;
  onImageChange: (file: File | null) => void;
}

const ImageUploadZone = ({ label, sublabel, image, onImageChange }: ImageUploadZoneProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 15 * 1024 * 1024) {
        alert("File must be under 15MB");
        return;
      }
      onImageChange(file);
    },
    [onImageChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  if (image) {
    return (
      <div className="relative aspect-[3/4] bg-secondary border border-border overflow-hidden group">
        <img src={image} alt={label} className="w-full h-full object-cover" />
        <button
          onClick={() => onImageChange(null)}
          className="absolute top-3 right-3 bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-4">
          <p className="text-primary-foreground text-sm font-medium">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`aspect-[3/4] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
        dragOver ? "border-foreground bg-secondary" : "border-border hover:border-muted-foreground"
      }`}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
      />
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="w-14 h-14 flex items-center justify-center bg-secondary rounded-full">
          {label.includes("Your") ? <Upload size={24} /> : <ImageIcon size={24} />}
        </div>
        <div className="text-center px-4">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs mt-1">{sublabel}</p>
        </div>
      </div>
    </label>
  );
};

export default ImageUploadZone;
