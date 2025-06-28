"use client";

import { useState } from "react";
import FileUpload from "./components/FileUpload";
import DocsList from "./components/DocsList";
import { Toaster } from "react-hot-toast";

function App() {
  const [docs, setDocs] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📄 ZenDocs</h1>
          <p className="text-gray-600 text-lg">
            Generate documentation for your JavaScript/TypeScript projects
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <FileUpload setDocs={setDocs} />
          <DocsList docs={docs} />
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
