import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Wallet.module.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { defaultNode, nodeList, faucetDetails } from "../recoil/atoms";
import AccountInfo from "../Components/Wallet/AccountInfo";
import hashes from "../lib/hashes";
import elliptic from "../lib/elliptic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Modal, Button, Overlay, Popover } from "react-bootstrap";

export default function Wallet() {
  const _defaultNode = useRecoilValue(defaultNode);
  const _faucetDetails = useRecoilValue(faucetDetails);
  const [balance, setBalance] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [show, setShow] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [selectedNode, setSelectedNode] = useState(_defaultNode);
  const [txHash, setTxHash] = useState("");
  const [minerAddress, setMinerAddress] = useState(
    "0000000000000000000000000000000000000000"
  );
  const [showDonate, setShowDonate] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const router = useRouter();
  const handleShow = () => setShow(true);
  const [value, setValue] = useState(5000);
  const nodes = useRecoilValue(nodeList);

  useEffect(() => {
    setUserAddress(sessionStorage.getItem("address"));

    async function getBalance() {
      let [balances] = await Promise.all([
        axios.get(
          `http://localhost:3001/address/${_faucetDetails.address}/balance`
        ),
      ]);

      const { confirmedBalance } = balances.data;
      setBalance(confirmedBalance);
    }

    getBalance();
  }, []);

  const handleClose = async () => {
    setUserAddress(sessionStorage.getItem("address"));

    let [balances] = await Promise.all([
      axios.get(
        `http://localhost:3001/address/${_faucetDetails.address}/balance`
      ),
    ]);

    const { confirmedBalance } = balances.data;
    setBalance(confirmedBalance);

    setShow(false);
    setTxHash("");
  };

  const signTransaction = () => {
    const validAddress = /^[0-9a-f]{40}$/.test(userAddress);

    if (!validAddress) {
      toast.error("Invalid Recipient Address!", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    // Check if withdraw timer is not expired
    const durationTarget = sessionStorage.getItem("faucetTimer");

    if (durationTarget) {
      const now = new Date();
      const time = now.getTime();
      const timeStamp = Math.floor(time / 1000);

      const timeStampDiff = sessionStorage.getItem("faucetTimer") - timeStamp;
      if (timeStampDiff > 0) {
        toast.error(
          `You will need to wait ${timeStampDiff} seconds before requesting tokens.`,
          {
            position: "bottom-right",
            theme: "colored",
          }
        );
        return;
      }
    }
    console.log(_faucetDetails.address);
    let transaction = {
      from: _faucetDetails.address,
      to: userAddress,
      value,
      fee: 0,
      dateCreated: new Date().toISOString(),
      data: "Faucet Tx",
      senderPubKey: _faucetDetails.pubKey,
    };

    // Construct the transaction hash
    let transactionJSON = JSON.stringify(transaction);
    transaction.transactionDataHash = new hashes.SHA256().hex(transactionJSON);

    console.log(_faucetDetails);
    // Sign the transaction hash
    transaction.senderSignature = signData(
      transaction.transactionDataHash,
      _faucetDetails.privKey
    );
    console.log(transaction);
    sendTransaction(transaction);
  };

  const signData = (data, privKey) => {
    const secp256k1 = new elliptic.ec("secp256k1");
    let keyPair = secp256k1.keyFromPrivate(privKey);
    let signature = keyPair.sign(data);
    return [signature.r.toString(16), signature.s.toString(16)];
  };

  const sendTransaction = async (signedTx) => {
    try {
      let nodeUrl = selectedNode;
      const config = {
        Footers: {
          "Content-Type": "application/json",
        },
      };
      console.log(signedTx);
      const result = await axios.post(
        `${nodeUrl}/transaction/broadcast`,
        signedTx,
        config
      );
      console.log(result);

      const error = result.data.error;

      if (error) {
        toast.error(error, {
          position: "bottom-right",
          theme: "colored",
        });
      } else {
        toast.success("Transaction successfully sent!", {
          position: "bottom-right",
          theme: "colored",
        });

        //Reset state
        setTxHash(result.data.transactionDataHash);

        //Reset Withdrawal Timer
        const now = new Date();
        const time = now.getTime() + Number(_faucetDetails.duration);
        const timeStamp = Math.floor(time / 1000);
        sessionStorage.setItem("faucetTimer", timeStamp);

        // Mine the block
        mineNextBlock();
      }
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed to send!", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const mineNextBlock = async () => {
    setIsMining(true);

    // Send the request to the node to start mining
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      minerAddress: minerAddress,
      difficulty: 5,
    };

    const miningResult = await axios.post(
      "http://localhost:3001/mine-next-block",
      body,
      config
    );

    const result = miningResult.data.message;
    setIsMining(false);

    // Display the transaction Receipt
    handleShow();

    if (result) {
      toast.success(result, {
        position: "bottom-right",
        theme: "colored",
      });
    } else {
      toast.error("Unable to mine block.", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleDonateClick = (event) => {
    setShowDonate(!showDonate);
    setTarget(event.target);
  };

  const donateNavigation = () => {
    sessionStorage.setItem("donate", true);
    router.push("/wallet/send-transaction");
  };
  return (
    <>
      <Head>
        <title>NOOB | Faucet</title>
      </Head>
      <ToastContainer position="top-center" pauseOnFocusLoss={false} />
      <div
        className={styles.background}
        style={{ display: "flex", justifyContent: "center" }}
      ></div>
      {/* Transaction Details */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-break">
          {/* Results */}
          <div className="text-center">
            <p className="fs-5 m-0">
              We sent <span className="fs-3 text-success">{value}</span> coins
              to address
            </p>

            <p className="fs-5 m-0">
              <a href="#" style={{ textDecoration: "none" }}>
                {userAddress}
              </a>
            </p>
            <p className="fs-5">
              tx:{" "}
              <a style={{ fontSize: "16px", textDecoration: "none" }} href="#">
                {txHash}
              </a>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      {/* Title */}
      <div className="container my-4">
        <div className="text-center">
          <h1 className="display-4 ">Faucet</h1>
          <div className="col-lg-auto lead">
            Noob Faucet is a free service that allows you to get NOOB tokens.
          </div>
          <p className="col-lg-auto lead">
            You will be required to wait 90 seconds before requesting additional
            tokens.
          </p>
          <div className="col-lg-auto fs-4">
            Available balance: {balance.toLocaleString("en-CA")} NOOBS
          </div>
        </div>
      </div>
      <div className="container" style={{ width: "45rem" }}>
        {/* Card */}
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <div className="fs-5">NoobChain Faucet</div>
            {/* <div className="pt-1" style={{ cursor: "pointer" }}>
              Donate?
            </div> */}
            <div ref={ref} style={{ marginRight: ".5rem" }}>
              <Button variant="outline-primary" onClick={handleDonateClick}>
                Donate
              </Button>

              <Overlay
                show={showDonate}
                target={target}
                placement="bottom"
                container={ref}
                containerPadding={20}
              >
                <Popover id="popover-contained">
                  <Popover.Header as="h3">
                    Send NOOB to the faucet
                  </Popover.Header>
                  <Popover.Body>
                    <Button className="px-5" onClick={donateNavigation}>
                      Go To Wallet
                    </Button>
                  </Popover.Body>
                </Popover>
              </Overlay>
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
                defaultValue={userAddress}
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
            {!txHash ? (
              <div className="p-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg mt-3 w-100"
                  onClick={signTransaction}
                >
                  Submit
                </button>
              </div>
            ) : (
              isMining && (
                <div className="d-flex justify-content-center">
                  <Image
                    src="/images/mining-progress.gif"
                    alt="progrees-bar"
                    width="50px"
                    height="30px"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {/* Display Account Information */}
      <AccountInfo />
    </>
  );
}
