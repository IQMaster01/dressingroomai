import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Download, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploadZone from "@/components/ImageUploadZone";
import { supabase } from "@/integrations/supabase/client";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const TryOn = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [clothFile, setClothFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUserImage = (file: File | null) => {
    if (!file) {
      setUserImage(null);
      setUserFile(null);
      return;
    }
    setUserImage(URL.createObjectURL(file));
    setUserFile(file);
    setResult(null);
  };

  const handleClothImage = (file: File | null) => {
    if (!file) {
      setClothImage(null);
      setClothFile(null);
      return;
    }
    setClothImage(URL.createObjectURL(file));
    setClothFile(file);
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!userFile || !clothFile) return;
    setLoading(true);
    setResult(null);

    try {
      const [userBase64, clothBase64] = await Promise.all([
        fileToBase64(userFile),
        fileToBase64(clothFile),
      ]);

      const { data, error } = await supabase.functions.invoke("virtual-tryon", {
        body: { userImage: userBase64, clothImage: clothBase64 },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Generation failed. Please try again.");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.resultImage) {
        setResult(data.resultImage);
        toast.success("Try-on generated successfully!");
      } else {
        toast.error("No image was generated. Try different photos.");
      }
    } catch (err) {
      console.error("Try-on error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "changing-room-ai-result.png";
    link.click();
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      if (navigator.share) {
        const blob = await fetch(result).then((r) => r.blob());
        const file = new File([blob], "tryon-result.png", { type: "image/png" });
        await navigator.share({ files: [file], title: "My Changing Room AI Try-On" });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.info("Share not supported on this device.");
    }
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
              sublabel="Upload a clothing photo or a person wearing the outfit."
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

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="border border-border bg-card overflow-hidden">
              <img src={result} alt="Try-on result" className="w-full aspect-[3/4] object-cover" />
              <div className="p-4 flex gap-3 justify-center border-t border-border">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
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
