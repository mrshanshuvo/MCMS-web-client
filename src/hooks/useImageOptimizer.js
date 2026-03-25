import imageCompression from "browser-image-compression";
import { useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Custom hook for client-side image optimization
 * @returns {Object} - { compressImage }
 */
const useImageOptimizer = () => {
  const compressImage = useCallback(async (file, customOptions = {}) => {
    const options = {
      maxSizeMB: 1, // Default max size in MB
      maxWidthOrHeight: 1920, // Default max resolution
      useWebWorker: true,
      fileType: "image/webp", // Convert to WebP for better compression
      ...customOptions,
    };

    try {
      if (!(file instanceof File)) {
        throw new Error("Input must be a File object.");
      }

      // Skip if file is already smaller than target size
      if (file.size <= options.maxSizeMB * 1024 * 1024 && !customOptions.forceCompression) {
          // Still return the file but maybe it's not compressed
          // Actually, imageCompression will still run even if it's small if requested
      }

      const compressedFile = await imageCompression(file, options);
      
      // If compressed file is larger than original, return original
      if (compressedFile.size > file.size) {
        return file;
      }

      return compressedFile;
    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("Failed to optimize image. Using original file.");
      return file;
    }
  }, []);

  return { compressImage };
};

export default useImageOptimizer;
