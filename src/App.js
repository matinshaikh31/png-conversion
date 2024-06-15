import React, { useState } from "react";
import JSZip from "jszip";

const App = () => {
  const [files, setFiles] = useState([]);
  const [originalFileNames, setOriginalFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipUrl, setZipUrl] = useState(null);

  const extractFileName = (fileName) => {
    return fileName.substring(0, fileName.lastIndexOf("."));
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    const fileArray = Array.from(fileList);
    setFiles(fileArray);
    const nameArray = fileArray.map((file) => extractFileName(file.name));
    setOriginalFileNames(nameArray);
  };

  const simulateConversion = async () => {
    setLoading(true);
    const zip = new JSZip();

    for (let i = 0; i < files.length; i += 50) {
      const filesSubset = files.slice(i, i + 50);
      const originalNamesSubset = originalFileNames.slice(i, i + 50);

      // Simulating image conversion
      const convertedFiles = await simulateConversionProcess(filesSubset);

      // Add converted files to ZIP with original names
      convertedFiles.forEach((file, index) => {
        zip.file(`${originalNamesSubset[index]}.png`, file, { binary: true });
      });

      // Update progress
      setProgress(Math.min(i + 50, files.length));

      // Pause between sets (adjust milliseconds as needed)
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Generate ZIP file
    const blob = await zip.generateAsync({ type: "blob" });

    // Create download URL
    const url = URL.createObjectURL(blob);
    setZipUrl(url);

    setLoading(false);
  };

  const simulateConversionProcess = async (filesSubset) => {
    // Simulate image conversion process
    const convertedFiles = await Promise.all(
      filesSubset.map(async (file) => {
        // Simulating conversion to PNG (replace with actual conversion logic)
        // For simulation, return a Blob representing a PNG file
        return new Blob([file], { type: "image/png" });
      })
    );
    return convertedFiles;
  };

  const handleDownload = () => {
    if (zipUrl) {
      const link = document.createElement("a");
      link.href = zipUrl;
      link.setAttribute("download", "converted_images.zip");
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full flex flex-col md:flex-row items-center md:items-start">
        <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Upload Image
          </h2>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={simulateConversion}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
          >
            Convert to PNG
          </button>
        </div>
        <div className="md:w-1/2 md:ml-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              PNG Image
            </h2>
            {loading && <div className="text-white">Loading...</div>}
            <div className="text-white">
              Progress: {progress}/{files.length}
            </div>
            {zipUrl && (
              <button
                onClick={handleDownload}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 text-center block"
              >
                Download ZIP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
