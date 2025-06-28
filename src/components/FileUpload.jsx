"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileArchive, Loader2, Sparkles, Download } from "lucide-react";
import toast from "react-hot-toast";
import API from "../utils/api";

const FileUpload = ({ setDocs }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Function to validate ZIP files with multiple MIME types
  const isValidZipFile = (file) => {
    const validMimeTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/x-zip",
      "multipart/x-zip",
      "application/octet-stream",
    ];
    const validExtensions = [".zip"];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    const hasValidMimeType = validMimeTypes.includes(file.type);

    return hasValidMimeType || hasValidExtension;
  };

  // Function to download documentation as markdown file
  const downloadAsMarkdown = (documentation, filename) => {
    const blob = new Blob([documentation], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_documentation.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidZipFile(selectedFile)) {
      setFile(selectedFile);
      toast.success("ZIP file selected successfully");
    } else {
      toast.error("Please select a valid ZIP file");
      console.log("File type detected:", selectedFile?.type);
      console.log("File name:", selectedFile?.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidZipFile(droppedFile)) {
      setFile(droppedFile);
      toast.success("ZIP file dropped successfully");
    } else {
      toast.error("Please drop a valid ZIP file");
      console.log("File type detected:", droppedFile?.type);
      console.log("File name:", droppedFile?.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a ZIP file first");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Processing your files...");

    const formData = new FormData();
    formData.append("projectZip", file);

    try {
      console.log("Starting upload...");

      const response = await API.post("/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 180000, // 3 minutes timeout
      });

      console.log("Response received:", response.status);
      console.log("Processed files:", response.data.processedFiles);

      if (response.data && response.data.documentation) {
        // Set the documentation data for display
        setDocs({
          documentation: response.data.documentation,
          files: response.data.files,
          processedFiles: response.data.processedFiles,
          successfulFiles: response.data.successfulFiles,
          markdownContent: response.data.documentation, // Store markdown content
          projectName: file.name.replace(".zip", ""),
        });

        // Auto-download the documentation as markdown
        downloadAsMarkdown(
          response.data.documentation,
          file.name.replace(".zip", "")
        );

        toast.success(
          `Successfully processed ${response.data.processedFiles} files! (${response.data.successfulFiles} successful)`,
          { id: loadingToast }
        );
      } else {
        throw new Error("No documentation data received");
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(
          `Error: ${error.response.data.message || "Upload failed"}`,
          { id: loadingToast }
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
        toast.error("Network error. Please check if the backend is running.", {
          id: loadingToast,
        });
      } else {
        console.error("Unexpected error:", error.message);
        toast.error(`Unexpected error: ${error.message}`, { id: loadingToast });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100"
      >
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragOver
              ? "border-blue-400 bg-blue-50/50 scale-[1.02]"
              : file
              ? "border-emerald-400 bg-emerald-50/50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: file ? 1 : 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="mb-4"
            animate={{
              scale: dragOver ? 1.1 : 1,
              rotate: dragOver ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {file ? (
              <FileArchive className="mx-auto h-12 w-12 text-emerald-500" />
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-emerald-600 font-medium flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="no-file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-600 mb-2 font-medium">
                  Drag & drop your ZIP file here
                </p>
                <p className="text-sm text-gray-400">
                  or click to browse your JavaScript/TypeScript project
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed,application/x-zip"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />

          <motion.label
            htmlFor="file-input"
            className="mt-4 inline-block cursor-pointer bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2.5 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium text-sm shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Files
          </motion.label>
        </motion.div>

        <motion.button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`w-full mt-6 py-3.5 px-4 rounded-xl font-medium transition-all duration-200 shadow-md ${
            !file || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
          }`}
          whileHover={!file || loading ? {} : { scale: 1.02 }}
          whileTap={!file || loading ? {} : { scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Loader2 className="animate-spin mr-3 h-5 w-5" />
                Generating Documentation...
              </motion.div>
            ) : (
              <motion.div
                key="generate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Documentation
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-xl p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="h-5 w-5 text-blue-500" />
                </motion.div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-medium">
                  Processing your files... This may take a few minutes depending
                  on the project size.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
