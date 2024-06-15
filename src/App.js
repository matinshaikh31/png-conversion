import React, { useState } from 'react';
import JSZip from 'jszip';

const App = () => {
  const [files, setFiles] = useState([]);
  const [originalFileNames, setOriginalFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipUrl, setZipUrl] = useState(null);

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    const fileArray = Array.from(fileList);
    setFiles(fileArray);
    const nameArray = fileArray.map((file) => file.name);
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
        zip.file(`${originalNamesSubset[index]}.png`, file);
      });

      // Update progress
      setProgress(Math.min(i + 50, files.length));

      // Pause between sets (adjust milliseconds as needed)
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Generate ZIP file
    const blob = await zip.generateAsync({ type: 'blob' });

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
        return new Blob([file], { type: 'image/png' });
      })
    );
    return convertedFiles;
  };

  const handleDownload = () => {
    if (zipUrl) {
      const link = document.createElement('a');
      link.href = zipUrl;
      link.setAttribute('download', 'converted_images.zip');
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={simulateConversion}>Convert to PNG</button>
      {loading && <div>Loading...</div>}
      <div>Progress: {progress}/{files.length}</div>
      {zipUrl && <button onClick={handleDownload}>Download ZIP</button>}
    </div>
  );
};

export default App;
