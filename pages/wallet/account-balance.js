import Head from "next/head";
import MenuBar from "../../Components/Wallet/MenuBar";
import AccountInfo from "../../Components/Wallet/AccountInfo";
import { useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { lockState } from "../../recoil/atoms";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";

export default function AccountBalances() {
  const [userAddress, setUserAddress] = useState("");
  const [confirmedBalance, setConfirmedBalance] = useState("");
  const [pendingBalance, setPendingBalance] = useState("");
  const [safeBalance, setSafeBalance] = useState("");
  const [safeCount, setSafeCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const walletStatus = useRecoilValue(lockState);
  const nodeUrl = "http://localhost:3001";

  const handleClick = async () => {
    console.log("handleClick");
    if (!userAddress) {
      toast.error("Please enter an address.", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    const isValidAddress = /^[0-9a-f]{40}$/.test(userAddress);
    if (!isValidAddress) {
      toast.error("Invalid address.", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    let [balances] = await Promise.all([
      axios.get(`${nodeUrl}/address/${userAddress}/balance`),
    ]);

    console.log(balances);

    const { confirmedBalance, pendingBalance, safeBalance, safeCount } =
      balances.data;
    setConfirmedBalance(confirmedBalance);
    setPendingBalance(pendingBalance);
    setSafeBalance(safeBalance);
    setSafeCount(safeCount);
    setShowDetails(true);
  };

  return (
    <>
      <Head>
        <title>NOOB Wallet | Balances</title>
      </Head>

      <ToastContainer position="top-center" pauseOnFocusLoss={false} />
      <MenuBar />
      <div className="container ">
        <h1 className="display-5 my-5">View Account Balance</h1>

        <div className="d-flex align-items-between my-2">
          <input
            type="text"
            className=" w-100 py-1"
            placeholder="Enter your wallet address"
            style={{ marginRight: "10px" }}
            value={userAddress}
            onChange={(e) => {
              setUserAddress(e.target.value);
            }}
          />
          <button
            type="button"
            className="btn btn-primary btn w-25"
            onClick={handleClick}
          >
            Display Balance
          </button>
        </div>

        {showDetails && (
          <>
            <div className="mt-5">
              <h1 className="display-5">Balance Details</h1>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Safe</td>
                  <td>{safeBalance.toLocaleString("en-CA")}</td>
                </tr>
                <tr>
                  <td>Confirmed</td>
                  <td>{confirmedBalance.toLocaleString("en-CA")}</td>
                </tr>
                <tr>
                  <td>Pending</td>
                  <td>{pendingBalance.toLocaleString("en-CA")}</td>
                </tr>
              </tbody>
            </table>

            <ul className="list-group mt-5">
              <li className="list-group-item">
                <strong>SAFE | </strong> These funds are considered safe once{" "}
                {safeCount} additional blocks have been mined.{" "}
              </li>
              <li className="list-group-item ">
                <strong>CONFIRMED | </strong> Your transactions have been mined
                and are on the blockchain.
              </li>
              <li className="list-group-item">
                <strong>PENDING | </strong> These funds are currently waiting
                for the next block to be mined.
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Display Account Information */}
      <AccountInfo />
    </>
  );
}
