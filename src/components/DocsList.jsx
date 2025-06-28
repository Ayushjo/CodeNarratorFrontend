import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  BookOpen,
  Code,
  FileCode,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const DocsList = ({ docs }) => {
  const [expandedDocs, setExpandedDocs] = useState(new Set());
  const [copiedFiles, setCopiedFiles] = useState(new Set());

  // Function to download documentation as markdown file
  const downloadAsMarkdown = (documentation, projectName) => {
    const blob = new Blob([documentation], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName}_documentation.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Documentation downloaded successfully!");
  };

  // Function to copy individual file documentation
  const copyFileDocumentation = async (fileDoc, fileName) => {
    try {
      await navigator.clipboard.writeText(fileDoc);
      setCopiedFiles((prev) => new Set([...prev, fileName]));
      toast.success(`${fileName} documentation copied to clipboard!`);

      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopiedFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileName);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Function to toggle expanded view for individual files
  const toggleExpanded = (fileName) => {
    setExpandedDocs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  // Function to render markdown content with basic formatting
  const renderMarkdown = (content) => {
    if (!content) return null;

    // Split content into lines for basic markdown rendering
    const lines = content.split("\n");
    const elements = [];
    let currentParagraph = [];

    lines.forEach((line, index) => {
      if (line.startsWith("# ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p
              key={`p-${index}`}
              className="mb-4 text-gray-700 leading-relaxed"
            >
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h1
            key={index}
            className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p
              key={`p-${index}`}
              className="mb-4 text-gray-700 leading-relaxed"
            >
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h2
            key={index}
            className="text-xl font-semibold text-gray-800 mb-3 mt-6"
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p
              key={`p-${index}`}
              className="mb-4 text-gray-700 leading-relaxed"
            >
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h3
            key={index}
            className="text-lg font-medium text-gray-800 mb-2 mt-4"
          >
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("```")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p
              key={`p-${index}`}
              className="mb-4 text-gray-700 leading-relaxed"
            >
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        // Handle code blocks (basic implementation)
        elements.push(
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto"
          >
            <code className="text-gray-800">{line}</code>
          </div>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p
              key={`p-${index}`}
              className="mb-4 text-gray-700 leading-relaxed"
            >
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <li key={index} className="ml-6 mb-2 text-gray-700">
            {line.substring(2)}
          </li>
        );
      } else if (line.trim() === "") {
        if (currentParagraph.length > 0) {
          elements.push(
            <p
              key={`p-${index}`}
              className="mb-4 text-gray-700 leading-relaxed"
            >
              {currentParagraph.join(" ")}
            </p>
          );
          currentParagraph = [];
        }
      } else if (line.trim() !== "") {
        currentParagraph.push(line);
      }
    });

    // Add any remaining paragraph
    if (currentParagraph.length > 0) {
      elements.push(
        <p key="final-p" className="mb-4 text-gray-700 leading-relaxed">
          {currentParagraph.join(" ")}
        </p>
      );
    }

    return elements;
  };

  if (!docs || !docs.files || docs.files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
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

  const successfulDocs = docs.files.filter(
    (doc) => doc.hasDocumentation
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-6xl"
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
              {docs.files.length} file{docs.files.length !== 1 ? "s" : ""}{" "}
              processed
            </p>
          </div>

          <motion.button
            onClick={() =>
              downloadAsMarkdown(
                docs.documentation,
                docs.projectName || "project"
              )
            }
            className="bg-white/90 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-white transition-all duration-200 flex items-center shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Markdown
          </motion.button>
        </div>

        {/* Files List */}
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {docs.files.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:bg-gray-50/50 transition-all duration-200"
            >
              <div className="p-6">
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

                    <div className="flex items-center gap-3 mb-3">
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

                      {doc.hasDocumentation && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleExpanded(doc.file)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                          >
                            {expandedDocs.has(doc.file) ? (
                              <>
                                <EyeOff className="mr-1 h-3 w-3" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              copyFileDocumentation(doc.summary, doc.file)
                            }
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors"
                          >
                            {copiedFiles.has(doc.file) ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1 h-3 w-3" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
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
                  </div>
                </div>

                {/* Expanded Documentation View */}
                <AnimatePresence>
                  {expandedDocs.has(doc.file) && doc.hasDocumentation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 bg-gray-50/50 rounded-lg p-6 border border-gray-200"
                    >
                      <div className="prose prose-sm max-w-none">
                        {renderMarkdown(doc.summary)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <span>of {docs.files.length} files successfully documented</span>
            </div>

            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Project: {docs.projectName || "Unknown"}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Documentation View */}
      {docs.documentation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Complete Documentation
            </h3>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              {renderMarkdown(docs.documentation)}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DocsList;
