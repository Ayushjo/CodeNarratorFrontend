import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  Code,
  FileCode,
} from "lucide-react";
import API from "../utils/api";

const DocsList = ({ docs, fileName }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!fileName) {
      alert("No documentation file available for download");
      return;
    }

    setDownloading(true);

    try {
      // Get the Supabase URL from your backend
      const response = await API.get(`/download/${fileName}`, {
        timeout: 30000,
      });

      // Extract the PDF URL from the response
      const pdfUrl = response.data.url;

      if (!pdfUrl) {
        throw new Error("No PDF URL received from server");
      }

      // For Supabase URLs, we can directly download or open
      // Check if it's a Supabase URL
      if (pdfUrl.includes("supabase.co")) {
        // Option 1: Direct download
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", fileName.replace(".md", ".pdf"));
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // Fallback for other URLs
        window.open(pdfUrl, "_blank");
      }

      alert("✅ PDF download initiated successfully!");
    } catch (error) {
      console.error("Download error:", error);
      if (error.response) {
        const errorMessage = error.response.data.message || "Unknown error";
        alert(`Download failed: ${errorMessage}`);

        // Log more details for debugging
        console.error("Response data:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        alert("Network error. Please check if the backend is running.");
        console.error("Request error:", error.request);
      } else {
        alert(`Failed to download PDF: ${error.message}`);
      }
    } finally {
      setDownloading(false);
    }
  };

  if (!docs || docs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <motion.div
            className="mb-6"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <FileText className="mx-auto h-16 w-16 text-gray-300" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            No Documentation Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Upload a ZIP file containing your JavaScript/TypeScript project to
            generate comprehensive documentation.
          </p>
        </div>
      </motion.div>
    );
  }

  const successfulDocs = docs.filter((doc) => doc.hasDocumentation).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-4xl"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <BookOpen className="h-6 w-6" />
              Generated Documentation
            </h2>
            <p className="text-slate-200 text-sm mt-1">
              {docs.length} file{docs.length !== 1 ? "s" : ""} processed
            </p>
          </div>

          <AnimatePresence>
            {fileName && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="bg-white/90 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md"
                whileHover={{ scale: downloading ? 1 : 1.05 }}
                whileTap={{ scale: downloading ? 1 : 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {downloading ? (
                    <motion.div
                      key="downloading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Generating PDF...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="download"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Files List */}
        <div className="divide-y divide-gray-100">
          {docs.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50/50 transition-all duration-200"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <motion.div
                      className={`flex-shrink-0 w-3 h-3 rounded-full mr-3 ${
                        doc.hasDocumentation ? "bg-emerald-400" : "bg-red-400"
                      }`}
                      animate={{
                        scale: doc.hasDocumentation ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 2,
                        repeat: doc.hasDocumentation
                          ? Number.POSITIVE_INFINITY
                          : 0,
                        ease: "easeInOut",
                      }}
                    />
                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-gray-500" />
                      {doc.file}
                    </h3>
                  </div>

                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        doc.hasDocumentation
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {doc.hasDocumentation ? (
                        <>
                          <CheckCircle className="mr-1.5 h-3 w-3" />
                          Documentation Generated
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1.5 h-3 w-3" />
                          Failed to Generate
                        </>
                      )}
                    </span>
                  </motion.div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <motion.div
                    className="text-sm text-gray-500"
                    whileHover={{ scale: 1.05 }}
                  >
                    {doc.file.endsWith(".js") ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-medium border border-yellow-200">
                        <Code className="mr-1 h-3 w-3" />
                        JavaScript
                      </span>
                    ) : doc.file.endsWith(".ts") ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
                        <Code className="mr-1 h-3 w-3" />
                        TypeScript
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        <FileCode className="mr-1 h-3 w-3" />
                        Unknown
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Summary */}
        <motion.div
          className="bg-gray-50/50 px-6 py-4 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-emerald-600">
                {successfulDocs}
              </span>
              <span>of {docs.length} files successfully documented</span>
            </div>

            {fileName && (
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Documentation file: {fileName}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DocsList;
