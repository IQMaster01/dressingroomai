import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Download, Share2, Loader2 } from "lucide-react";
import ImageUploadZone from "@/components/ImageUploadZone";

const TryOn = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUserImage = (file: File | null) => {
    if (!file) { setUserImage(null); return; }
    const url = URL.createObjectURL(file);
    setUserImage(url);
    setResult(null);
  };

  const handleClothImage = (file: File | null) => {
    if (!file) { setClothImage(null); return; }
    const url = URL.createObjectURL(file);
    setClothImage(url);
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!userImage || !clothImage) return;
    setLoading(true);
    // Simulated — backend integration needed via Lovable Cloud
    await new Promise((r) => setTimeout(r, 3000));
    setResult(userImage); // placeholder result
    setLoading(false);
  };

  const canGenerate = userImage && clothImage && !loading;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Virtual Fitting Room
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold">
            Try It On
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Upload your photo and a clothing item to see yourself wearing it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ImageUploadZone
              label="Your Photo"
              sublabel="JPG or PNG, max 15MB. Full, half, or upper body."
              image={userImage}
              onImageChange={handleUserImage}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ImageUploadZone
              label="Clothing Item"
              sublabel="Upload a clothing photo or pick from gallery."
              image={clothImage}
              onImageChange={handleClothImage}
            />
          </motion.div>
        </div>

        <div className="text-center mb-12">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="bg-primary text-primary-foreground px-10 py-3.5 font-body text-sm font-semibold uppercase tracking-wider disabled:opacity-40 hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Try-On
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="border border-border bg-card overflow-hidden">
              <img src={result} alt="Try-on result" className="w-full aspect-[3/4] object-cover" />
              <div className="p-4 flex gap-3 justify-center border-t border-border">
                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Download size={16} /> Download
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TryOn;
