import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
}

const ImageUploader = ({ onImageUpload, imagePreview }: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    multiple: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={`border-4 border-dashed rounded-2xl p-6 h-96 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 
        ${
          isDragActive
            ? 'border-green-500 bg-green-100/30 shadow-lg'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md'
        }`}
      >
        <input {...getInputProps()} />
        {imagePreview ? (
          <motion.img
            src={imagePreview}
            alt="Preview"
            className="max-h-full max-w-full object-contain rounded-lg shadow-inner"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-green-200/20 dark:bg-green-700/20 p-4 rounded-full inline-block mb-4">
              <UploadCloud className="w-16 h-16 text-green-600 dark:text-green-300" />
            </div>
            <p className="font-semibold text-lg text-gray-700 dark:text-gray-200">
              {isDragActive ? 'Drop the image here!' : 'Drag & drop an animal image'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              or click to select a file
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUploader;
