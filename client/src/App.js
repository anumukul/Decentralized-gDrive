import Upload from './artifacts/contracts/Upload.sol/Upload.json';
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          // Use BrowserProvider instead of Web3Provider in v6
          const provider = new BrowserProvider(window.ethereum);

          // Setup event listeners
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          // Request accounts
          await window.ethereum.request({ method: "eth_requestAccounts" });
          
          // Get signer - in v6 this is an async operation
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = "0xA56a63E6a1107077ea0768311870F9F9978Ce0f1";

          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );

          setContract(contract);
          setProvider(provider);
        } else {
          console.error("Metamask is not installed");
        }
      } catch (error) {
        console.error("Error initializing provider:", error);
      }
    };

    initializeProvider();
  }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>Gdrive 3.0</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}

export default App;