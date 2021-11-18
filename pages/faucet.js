import Head from "next/head";
import styles from "../styles/Wallet.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { lockState, nodeList } from "../recoil/atoms";
import AccountInfo from "../Components/Wallet/AccountInfo";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedNode, setSelectedNode] = useState("");

  const nodes = useRecoilValue(nodeList);

  useEffect(() => {
    setUserAddress(sessionStorage.getItem("address"));

    console.log(nodes);
    async function getBalance() {
      let [balances] = await Promise.all([
        axios.get(`http://localhost:3001/address/0e5092f2dbcf00995b1aae95bc7ec8a1b6596fb8
/balance`),
      ]);

      const { confirmedBalance } = balances.data;
      setBalance(confirmedBalance);
    }

    getBalance();
  }, []);

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <>
      <Head>
        <title>NOOB | Faucet</title>
      </Head>

      <h3>{balance}</h3>
      <div
        className={styles.background}
        style={{ display: "flex", justifyContent: "center" }}
      ></div>
      <section id="viewHome">
        <div className="mt-5 pt-3">
          <div className="container" style={{ width: "35rem" }}>
            {/* Card */}
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="fs-5">NoobChain Faucet</div>
                <div className="pt-1" style={{ cursor: "pointer" }}>
                  Donate?
                </div>
              </div>
              <div className="card-body">
                {/* Recipient */}
                <div className="input-group mb-3 p-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      Recipient
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="basic-url"
                    aria-describedby="basic-addon3"
                    placeholder="0xx..."
                    value={userAddress}
                  />
                </div>

                {/* Select Node Url */}
                <div className="input-group mb-3 p-2">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Node Url
                    </label>
                  </div>
                  <select
                    value={selectedNode}
                    className="form-control"
                    id="inputGroupSelect01"
                    onChange={(e) => {
                      setSelectedNode(e.target.value);
                    }}
                  >
                    {nodes &&
                      nodes.map((node, index) => (
                        <option key={index} value={node}>
                          {node}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Button */}
                <div className="p-2">
                  <button
                    type="button"
                    id="buttonGenerateNewWallet"
                    value="Generate Now"
                    className="btn btn-primary btn-lg mt-3 w-100"
                    onClick={handleClick}
                  >
                    Submit
                  </button>
                </div>

                {showDetails && (
                  <>
                    {/* Results */}
                    <div className="text-center">
                      <p className="fs-5 m-0">
                        We sent{" "}
                        <span className="fs-3 text-success">0.34343434</span>{" "}
                        coins to address
                      </p>

                      <p className="fs-5 m-0">
                        <a href="#" style={{ textDecoration: "none" }}>
                          0xdfsdfsfsdfsdflkjsflsd8fe3h98r32hr9832
                        </a>
                      </p>
                      <p className="fs-5">
                        tx:{" "}
                        <a
                          style={{ fontSize: "16px", textDecoration: "none" }}
                          href="#"
                        >
                          90093840934803j4lk34jh389hjr03u434u3
                        </a>
                      </p>
                      <button
                        type="button"
                        id="buttonGenerateNewWallet"
                        className="btn btn-primary btn-lg  w-100"
                      >
                        Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Display Account Information */}
      <AccountInfo />
    </>
  );
}
