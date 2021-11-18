import Head from "next/head";
import { useRef } from "react";
import MenuBar from "../../Components/Wallet/MenuBar";
import elliptic from "../../lib/elliptic";
import AccountInfo from "../../Components/Wallet/AccountInfo";
import { useRecoilState } from "recoil";
import { lockState } from "../../recoil/atoms.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { saveKeysInSession } from "../../lib/session";

export default function CreateNewWallet() {
  const [walletStatus, setWalletStatus] = useRecoilState(lockState);

  const secp256k1 = new elliptic.ec("secp256k1");
  const textAreaRef = useRef("");

  const handleClick = () => {
    let keyPair = secp256k1.genKeyPair();
    saveKeysInSession(keyPair);
    // display result
    textAreaRef.current.value =
      "Generated random private key: " +
      sessionStorage["privKey"] +
      "\n" +
      "\n" +
      "Extracted public key: " +
      sessionStorage["pubKey"] +
      "\n" +
      "\n" +
      "Extracted blockchain address: " +
      sessionStorage["address"];

    setWalletStatus("unlocked");

    toast.success("Wallet created successfully!", {
      position: "bottom-right",
      theme: "colored",
    });
  };

  return (
    <>
      <Head>
        <title>NOOB Wallet | New Wallet</title>
      </Head>

      <ToastContainer position="top-center" pauseOnFocusLoss={false} />
      <MenuBar />

      <div className="container">
        <h1 className="display-5 my-5">Create a New Wallet</h1>

        <form>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="5"
              ref={textAreaRef}
            ></textarea>
          </div>
          <button
            type="button"
            value="Generate Now"
            className="btn btn-primary btn mt-3 w-100"
            onClick={handleClick}
          >
            Generate Now
          </button>
        </form>
      </div>

      {/* Display Account Information */}
      <AccountInfo />
    </>
  );
}
