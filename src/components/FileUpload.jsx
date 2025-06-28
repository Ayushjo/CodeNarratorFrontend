"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileArchive, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const FileUpload = ({ setDocs }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isValidZipFile = (file) => {
    return (
      file.name.toLowerCase().endsWith(".zip") || file.type.includes("zip")
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidZipFile(selectedFile)) {
      setFile(selectedFile);
      toast.success("ZIP file selected");
    } else {
      toast.error("Please select a ZIP file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidZipFile(droppedFile)) {
      setFile(droppedFile);
      toast.success("ZIP file dropped");
    } else {
      toast.error("Please drop a ZIP file");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("projectZip", file);

    try {
      const response = await fetch(
        "https://codenarrator.onrender.com/api/docs/generate",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setDocs(data);
      toast.success(`Processed ${data.processedFiles} files!`);
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100"
      >
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragOver
              ? "border-blue-400 bg-blue-50/50"
              : file
              ? "border-emerald-400 bg-emerald-50/50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
        >
          <div className="mb-4">
            {file ? (
              <FileArchive className="mx-auto h-12 w-12 text-emerald-500" />
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
          </div>

          {file ? (
            <div>
              <p className="text-emerald-600 font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop your ZIP file here
              </p>
              <p className="text-sm text-gray-400">or click to browse</p>
            </div>
          )}

          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />

          <label
            htmlFor="file-input"
            className="mt-4 inline-block cursor-pointer bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            Browse Files
          </label>
        </motion.div>

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`w-full mt-6 py-3.5 px-4 rounded-xl font-medium transition-colors ${
            !file || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-3 h-5 w-5" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Documentation
            </div>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default FileUpload;
