import Head from "next/head";
import Image from "next/image";
import MenuBar from "../../Components/Wallet/MenuBar";
import { Toast } from "react-bootstrap";

export default function OpenExistingWallet() {
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

      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          zIndex: "4",
        }}
      >
        <Toast className="ml-10">
          <Toast.Header>
            <Image
              src="/images/block.png"
              width="16px"
              height="16px"
              className="rounded"
              alt=""
            />
            <strong className="me-auto">Address:</strong>
            0xjoidsfh87sdfod8sfsdufsfdsd
          </Toast.Header>
          <Toast.Body>Node URL: http//localhost:3001</Toast.Body>
        </Toast>
      </div>
    </>
  );
}
