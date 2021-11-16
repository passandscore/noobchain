import Head from "next/head";
import Image from "next/image";
import MenuBar from "../../Components/Wallet/MenuBar";

export default function CreateNewWallet() {
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
            <textarea className="form-control" rows="6"></textarea>
          </div>
          <button
            type="button"
            id="buttonGenerateNewWallet"
            value="Generate Now"
            className="btn btn-primary btn mt-3 w-100"
          >
            Generate Now
          </button>
        </form>
      </div>
    </>
  );
}
