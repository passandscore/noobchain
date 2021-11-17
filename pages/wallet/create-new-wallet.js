import Head from "next/head";
import { useState, useRef } from "react";
import MenuBar from "../../Components/Wallet/MenuBar";
import hashes from "../../lib/hashes";
import elliptic from "../../lib/elliptic";
import AccountInfo from "../../Components/Wallet/AccountInfo";
import { useRecoilState } from "recoil";
import { lockState } from "../../recoil/atoms.js";

export default function CreateNewWallet() {
  const [walletStatus, setWalletStatus] = useRecoilState(lockState);

  const secp256k1 = new elliptic.ec("secp256k1");
  const textAreaRef = useRef(null);

  const handleClick = () => {
    console.log("clicked");
    let keyPair = secp256k1.genKeyPair();
    saveKeysInSession(keyPair);
  };

  const saveKeysInSession = (keyPair) => {
    console.log("saving keys in session");
    sessionStorage["privKey"] = keyPair.getPrivate().toString(16);
    let pubKey =
      keyPair.getPublic().getX().toString(16) +
      (keyPair.getPublic().getY().isOdd() ? "1" : "0");
    sessionStorage["pubKey"] = pubKey;
    let ripemd160 = new hashes.RMD160();
    sessionStorage["address"] = ripemd160.hex(pubKey);

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
  };

  return (
    <>
      <Head>
        <title>NOOB Wallet | New Wallet</title>
      </Head>

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
      {walletStatus == "unlocked" && <AccountInfo />}
    </>
  );
}
