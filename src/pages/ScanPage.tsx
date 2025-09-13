import { useState, ChangeEvent, DragEvent, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PawPrint, Feather, XCircle, Search, Sparkles, CloudUpload, Repeat, ListChecks, Info, RefreshCcw } from "lucide-react";
import clsx from "clsx";

// Interfaces to match the backend response
interface SpeciesInfo {
  species: string;
  kingdom: string;
  class: string;
  subclass: string;
  habitat: string;
  diet: string;
  lifespan: string;
  fact: string;
}

interface PredictionResponse {
  prediction: string;
  confidence: number;
  top5: {
    label: string;
    confidence: number;
  }[];
  species_info: SpeciesInfo;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:7860";

const ScanPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing Ecosystem...");

  // Dynamic loading text effect
  useEffect(() => {
    if (loading) {
      const messages = [
        "Analyzing Ecosystem...",
        "Searching through the wild...",
        "Identifying the creature...",
        "Almost there..."
      ];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingText(messages[index]);
        index = (index + 1) % messages.length;
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setResult(null);
    setErrorMessage("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<PredictionResponse>(
        `${BACKEND_URL}/predict`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(response.data);
    } catch (error: any) {
      console.error("Prediction Error:", error);
      setErrorMessage(
        error.response?.data?.detail || "Prediction failed. Check network or server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      handleImageUpload(event.target.files[0]);
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMessage("");
    setImagePreview(null);
    setLoading(false);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      handleImageUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Image Uploader UI component
  const ImageUploaderUI = () => (
    <div
      className={clsx(
        "relative w-full aspect-square border-2 border-dashed rounded-xl transition-colors duration-300 p-4",
        dragActive ? "border-green-500 bg-green-500/10" : "border-gray-300 dark:border-gray-600"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      role="region"
      aria-label="Drag and drop image upload area"
    >
      <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} disabled={loading} />
      {!imagePreview ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-full text-center cursor-pointer text-gray-500 dark:text-gray-400"
        >
          {loading ? (
            <div className="flex flex-col items-center">
              <RefreshCcw className="w-12 h-12 text-green-500 animate-spin" aria-label="Uploading, please wait" />
              <p className="mt-4 text-xl font-semibold">Uploading...</p>
            </div>
          ) : (
            <>
              <CloudUpload className="w-16 h-16 mb-4 text-green-500" aria-label="Upload icon" />
              <p className="text-xl font-semibold">Click or drag an image here</p>
              <p className="text-sm mt-2">JPG, PNG, GIF, or WEBP</p>
            </>
          )}
        </label>
      ) : (
        <div className="w-full h-full rounded-lg overflow-hidden relative">
          <img src={imagePreview} alt="Uploaded image preview" className="w-full h-full object-cover rounded-lg" />
        </div>
      )}
    </div>
  );

  // Results Panel UI component
  const ResultsPanelUI = () => {
    if (!result) return null;
    const confidence = result.confidence.toFixed(2);

    return (
      <div className="w-full flex flex-col items-center space-y-6 animate-fadeIn">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{result.prediction}</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            Confidence: <span className="font-bold">{confidence}%</span>
          </p>
          {Number(confidence) < 80 && (
            <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
              <Info className="w-4 h-4 mr-1" aria-label="Information icon" />
              <p>Confidence is low. Try a clearer image.</p>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-inner">
          <div className="flex items-center text-gray-800 dark:text-gray-200 mb-3 font-semibold">
            <ListChecks className="w-5 h-5 mr-2" aria-label="Checklist icon" />
            <h3 className="text-lg">Top 5 Possibilities</h3>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            {result.top5.map((pred, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800 dark:text-gray-200">{pred.label}</span>
                <span className="text-sm font-mono">{(pred.confidence).toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={handleReset}
          className="mt-6 px-6 py-2 rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors font-semibold shadow-lg flex items-center"
        >
          <Repeat className="w-5 h-5 mr-2" aria-label="Repeat icon" /> Scan Another Image
        </button>

        {result.species_info && (
          <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-inner mt-4 animate-fadeIn" role="region" aria-label="Species information">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Species Information</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
              <li><span className="font-bold">Species:</span> {result.species_info.species}</li>
              <li><span className="font-bold">Kingdom:</span> {result.species_info.kingdom}</li>
              <li><span className="font-bold">Class:</span> {result.species_info.class}</li>
              <li><span className="font-bold">Subclass:</span> {result.species_info.subclass}</li>
              <li><span className="font-bold">Habitat:</span> {result.species_info.habitat}</li>
              <li><span className="font-bold">Diet:</span> {result.species_info.diet}</li>
              <li><span className="font-bold">Lifespan:</span> {result.species_info.lifespan}</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
              <p className="text-sm font-light"><span className="font-bold">Fact:</span> {result.species_info.fact}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col flex-grow relative min-h-screen">
      {/* Floating UI Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <Feather className="absolute top-10 left-[10%] w-8 h-8 text-green-400/10 -rotate-12 animate-float" aria-hidden="true" />
        <PawPrint className="absolute top-64 right-[10%] w-10 h-10 text-green-400/15 rotate-12 animate-float-delay" aria-hidden="true" />
        <Feather className="absolute bottom-20 left-[25%] w-6 h-6 text-green-400/10 rotate-45 animate-float-fast" aria-hidden="true" />
        <PawPrint className="absolute bottom-40 right-[25%] w-8 h-8 text-green-400/15 -rotate-45 animate-float-slow" aria-hidden="true" />
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-green-700 dark:text-green-300 mb-4 tracking-tight leading-tight">
          Discover the <span className="text-green-500 dark:text-green-400">Creature</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
          Upload a photo of an animal, and let WildScan use the power of AI to identify it for you.
        </p>
      </div>

      {/* Main Grid */}
      <div className={clsx(
        "grid grid-cols-1 gap-8 items-start max-w-7xl mx-auto relative z-10 w-full transition-all duration-500",
        imagePreview ? 'lg:grid-cols-[1fr_1.5fr]' : 'lg:grid-cols-2'
      )}>
        <ImageUploaderUI />
        <div className="relative min-h-[400px] flex flex-col items-center justify-center p-4 rounded-xl shadow-lg dark:shadow-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700">
          {loading && (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <PawPrint className="w-20 h-20 text-green-500 animate-bounce-slow" aria-label="Loading..." />
              <p className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300 animate-pulse">{loadingText}</p>
            </div>
          )}

          {errorMessage && (
            <div className="flex flex-col items-center justify-center text-center p-6 rounded-lg w-full">
              <XCircle className="w-16 h-16 text-red-500 mb-4 animate-shake" aria-label="Error icon" />
              <p className="text-lg font-medium text-red-600 dark:text-red-400">{errorMessage}</p>
              <button onClick={handleReset} className="mt-4 px-6 py-2 rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors font-semibold">
                Try Again
              </button>
            </div>
          )}

          {result && <ResultsPanelUI />}

          {!result && !loading && !errorMessage && (
            <div className="text-center text-gray-500 dark:text-gray-400 space-y-4 max-w-sm">
              <Search className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" aria-label="Search icon" />
              <p className="text-xl font-semibold">Your analysis will appear here.</p>
              <p>Upload a clear image of an animal to begin the identification process.</p>
            </div>
          )}
        </div>
      </div>

      <Sparkles className="absolute top-[20%] right-[30%] w-4 h-4 text-yellow-300/50 animate-sparkle" aria-hidden="true" />
      <Sparkles className="absolute bottom-[10%] left-[5%] w-3 h-3 text-yellow-300/50 animate-sparkle-delay" aria-hidden="true" />
    </div>
  );
};

export default ScanPage;