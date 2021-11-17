import Head from "next/head";
import MenuBar from "../../Components/Wallet/MenuBar";
import AccountInfo from "../../Components/Wallet/AccountInfo";
import { useRecoilValue } from "recoil";
import { lockState } from "../../recoil/atoms";

export default function AccountBalances() {
  const walletStatus = useRecoilValue(lockState);

  return (
    <>
      <Head>
        <title>NOOB Wallet | Balances</title>
      </Head>

      <MenuBar />
      <div className="container ">
        <h1 className="display-5 my-5">View Account Balance</h1>

        <div className="d-flex align-items-between my-2">
          <input
            type="text"
            id="textBoxPrivateKey"
            className=" w-100 py-1"
            placeholder="Enter your wallet address"
            style={{ marginRight: "10px" }}
            value=""
          />
          <button
            type="button"
            id="buttonOpenExistingWallet"
            value="Open Wallet"
            className="btn btn-primary btn w-25"
          >
            Display Balance
          </button>
        </div>

        <form>
          <div className="form-group">
            <textarea className="form-control" rows="6"></textarea>
          </div>
        </form>
      </div>

      {/* Display Account Information */}
      {walletStatus == "unlocked" && <AccountInfo />}
    </>
  );
}
