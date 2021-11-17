import Head from "next/head";
import { useEffect, useState } from "react";
import MenuBar from "../../Components/Wallet/MenuBar";
import AccountInfo from "../../Components/Wallet/AccountInfo";
import { useRecoilValue } from "recoil";
import { lockState } from "../../recoil/atoms";

export default function OpenExistingWallet() {
  const walletStatus = useRecoilValue(lockState);

  return (
    <>
      <Head>
        <title>NOOB Wallet | Open Wallet</title>
      </Head>

      <MenuBar />
      <div className="container ">
        <h1 className="display-5 my-5">Open Existing Wallet</h1>

        <div className="d-flex align-items-between my-2">
          <input
            type="text"
            id="textBoxPrivateKey"
            className=" w-100 py-1"
            placeholder="Enter your wallet private key (compressed ECDSA key, 65 hex digits)"
            style={{ marginRight: "10px" }}
            value=""
          />
          <button
            type="button"
            id="buttonOpenExistingWallet"
            value="Open Wallet"
            className="btn btn-primary btn w-25"
          >
            Restore
          </button>
        </div>

        <form>
          <div className="form-group">
            <textarea className="form-control" rows="6"></textarea>
          </div>
        </form>
      </div>

      {/* Display Account Information */}
      {!walletStatus && <AccountInfo />}
    </>
  );
}
