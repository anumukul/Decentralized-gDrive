import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");

  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
      return;
    }

    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");

      const images = str_array.map((item, i) => {
        // Convert IPFS hash to proper Pinata gateway URL
        const ipfsHash = item.replace("ipfs://", "");
        const pinataUrl = `https://turquoise-necessary-anteater-917.mypinata.cloud/ipfs/${ipfsHash}`;

        return (
          <div key={i} className="image-container">
            <a href={pinataUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={pinataUrl}
                alt={`IPFS asset ${i + 1}`}
                className="image-list"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "placeholder-image-url.jpg"; // Add a placeholder image URL
                  console.log(`Failed to load image: ${pinataUrl}`);
                }}
              />
            </a>
          </div>
        );
      });
      setData(images);
    } else {
      alert("No image to display");
    }
  };

  return (
    <div className="display-container">
      <div className="image-grid">{data}</div>
      <div className="controls">
        <input
          type="text"
          placeholder="Enter Address"
          className="address"
        />
        <button className="center button" onClick={getdata}>
          Get Data
        </button>
      </div>
    </div>
  );
};

export default Display;