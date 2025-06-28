import { useState } from "react";
import FileUpload from "./components/FileUpload";
import DocsList from "./components/DocsList";
import "./index.css";
import { Toaster } from "react-hot-toast";
function App() {
  const [docs, setDocs] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleDocs = (docData) => {
    setDocs(docData.docs);
    const path = docData.file.split("/").pop(); // extract filename
    setFileName(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">📄 ZenDocs</h1>
      <FileUpload setDocs={handleDocs} />
      <DocsList docs={docs} fileName={fileName} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
