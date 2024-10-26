import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `03585bfefa810b8c7f43`,
          pinata_secret_api_key: `97b8cb6696642c8b448d76c6e07a4264c449d14bccd3d20fdc43655b15a91f35`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Construct proper IPFS URL
      const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
      
      // Wait for the blockchain transaction to complete
      const transaction = await contract.add(account, ImgHash);
      await transaction.wait(); // Wait for transaction to be mined

      alert("Successfully uploaded image to IPFS and recorded on blockchain");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setFileName("No image selected");
      setFile(null);
    }
  };

  const retrieveFile = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file size (e.g., 5MB limit)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_SIZE) {
        alert('File size must be less than 5MB');
        e.target.value = ''; // Reset input
        return;
      }

      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        setFile(file);
        setFileName(file.name);
      };
    } catch (error) {
      console.error("File retrieval error:", error);
      alert("Error processing file. Please try again.");
    }
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account || uploading}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          accept="image/*"
        />
        <span className="textArea">Image: {fileName}</span>
        <button 
          type="submit" 
          className="upload" 
          disabled={!file || uploading || !account}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;