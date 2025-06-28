"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  BookOpen,
  Code,
  FileCode,
} from "lucide-react";
import toast from "react-hot-toast";

const DocsList = ({ docs }) => {
  const downloadMarkdown = () => {
    if (!docs?.documentation) return;

    const blob = new Blob([docs.documentation], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "documentation.md";
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  if (!docs || !docs.files) {
    return (
      <div className="w-full max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            No Documentation Yet
          </h3>
          <p className="text-gray-500">
            Upload a ZIP file to generate documentation
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-700 px-6 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <BookOpen className="h-6 w-6" />
              Generated Documentation
            </h2>
            <p className="text-slate-200 text-sm mt-1">
              {docs.processedFiles} files processed • {docs.successfulFiles}{" "}
              successful
            </p>
          </div>

          <button
            onClick={downloadMarkdown}
            className="bg-white text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </button>
        </div>

        {/* Files List */}
        <div className="divide-y divide-gray-100">
          {docs.files.map((doc, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      doc.hasDocumentation ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-gray-500" />
                    {doc.file}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doc.hasDocumentation
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {doc.hasDocumentation ? (
                      <>
                        <CheckCircle className="inline mr-1 h-3 w-3" />
                        Success
                      </>
                    ) : (
                      <>
                        <XCircle className="inline mr-1 h-3 w-3" />
                        Failed
                      </>
                    )}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      doc.file.endsWith(".js")
                        ? "bg-yellow-100 text-yellow-700"
                        : doc.file.endsWith(".ts")
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Code className="inline mr-1 h-3 w-3" />
                    {doc.file.endsWith(".js")
                      ? "JavaScript"
                      : doc.file.endsWith(".ts")
                      ? "TypeScript"
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              <CheckCircle className="inline h-4 w-4 text-green-500 mr-1" />
              {docs.successfulFiles} of {docs.processedFiles} files documented
            </span>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {docs.message}
            </span>
          </div>
        </div>
      </div>

      {/* Documentation Preview */}
      {docs.documentation && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">
              <FileText className="inline h-5 w-5 mr-2" />
              Documentation Preview
            </h3>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {docs.documentation.substring(0, 2000)}
              {docs.documentation.length > 2000 && "..."}
            </pre>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DocsList;
