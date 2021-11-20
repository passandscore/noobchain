import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Wallet.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  miningMode,
  address,
  miningDifficulty,
  nodeList,
} from "../recoil/atoms";
import AccountInfo from "../Components/Wallet/AccountInfo";
import { Modal, ButtonGroup, ToggleButton } from "react-bootstrap";

export default function Miner() {
  const [mode, setMode] = useRecoilState(miningMode);
  const [selectedDifficulty, setSelectedDifficulty] =
    useRecoilState(miningDifficulty);
  const walletAddress = useRecoilValue(address);
  const onlineNodes = useRecoilValue(nodeList);

  const [autoDetails, setAutoDetails] = useState(true);
  const [show, setShow] = useState(false);
  const [nodeInfo, setNodeInfo] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState(selectedDifficulty);
  const [allNodes, setAllNodes] = useState([
    { url: "http://localhost:3001", isMining: false },
    { url: "http://localhost:3002", isMining: false },
    { url: "http://localhost:3003", isMining: false },
    { url: "http://localhost:3004", isMining: false },
    { url: "http://localhost:3005", isMining: false },
  ]);
  const miningDifficultyRange = [
    { name: "1", value: "1" },
    { name: "2", value: "2" },
    { name: "3", value: "3" },
    { name: "4", value: "4" },
    { name: "5", value: "5" },
    { name: "6", value: "6" },
    { name: "7", value: "7" },
    { name: "8", value: "8" },
    { name: "9", value: "9" },
    { name: "10", value: "10" },
  ];

  useEffect(() => {
    console.log(onlineNodes);
    setRadioValue(selectedDifficulty);
  }, []);

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setMode(newMode);

    if (newMode === "manual") {
      setAutoDetails(false);
    } else {
      handleAutomaticMineClick();
    }
  };

  const handleClick = async (nodeUrl) => {
    const result = await axios.get(`${nodeUrl}/info`);
    setNodeInfo(result.data);
    handleShow();
  };

  const handleManualMineClick = async (nodeToMine) => {
    // Check if pending transactions exist
    const allTransactions = await axios.get(`${nodeToMine}/all-transactions`);
    const pendingTransactions = allTransactions.data.filter(
      (transaction) => transaction.transferSuccessful !== true
    ).length;

    console.log("pending: " + pendingTransactions);
    if (pendingTransactions === 0) {
      toast.error("There are no pending transactions to mine.", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    // Ensure that user has a wallet address
    if (!walletAddress) {
      toast.error("Require your mining address. Unlock your wallet.", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    // update the node list to show that the node is mining
    let updateNodeList = allNodes.map((node) => {
      if (node.url === nodeToMine) {
        node.isMining = true;
      }
      return node;
    });
    setAllNodes(updateNodeList);

    // Send the request to the node to start mining
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      minerAddress: walletAddress,
      difficulty: selectedDifficulty,
    };

    const miningResult = await axios.post(
      `${nodeToMine}/mine-next-block`,
      body,
      config
    );

    console.log(miningResult.data);
    const result = miningResult.data.message;

    if (miningResult) {
      let updateNodeList = allNodes.map((node) => {
        if (node.url === nodeToMine) {
          node.isMining = false;
        }
        return node;
      });
      toast.success(result, {
        position: "bottom-right",
        theme: "colored",
      });

      // Update the node list
      setAllNodes(updateNodeList);
    } else {
      toast.error("Unable to mine block.", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleAutomaticMineClick = async () => {
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
      "http://localhost:9000/mine-next-block",
      body,
      config
    );

    const result = miningResult.data.message;
  };

  return (
    <>
      <Head>
        <title>NOOB | Mining</title>
      </Head>

      <ToastContainer position="top-center" pauseOnFocusLoss={false} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{nodeInfo.nodeUrl}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-break">
          <table className="table">
            <tbody>
              <tr>
                <th scope="row">About</th>
                <td>{nodeInfo.about}</td>
              </tr>
              <tr>
                <th scope="row">Blocks</th>
                <td>{nodeInfo.blocks}</td>
              </tr>
              <tr>
                <th scope="row">Difficulty</th>
                <td>{nodeInfo.difficulty}</td>
              </tr>
              <tr>
                <th scope="row">Peers</th>
                <td>{nodeInfo.peers}</td>
              </tr>
              <tr>
                <th scope="row">Pending Transactions</th>
                <td>{nodeInfo.pendingTransactions}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>

      <div
        className={styles.background}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      ></div>

      {/* Title */}
      <div className="container mt-5">
        <div className="row ">
          <div className="col-sm-2">
            {" "}
            <Image
              src="/images/mining.png"
              alt="blocks-in-hand"
              width="175px"
              height="175px"
            />
          </div>
          <div className="col-sm-10">
            <h1 className="display-4">Mining</h1>
            <div className="col-lg-auto lead">
              Noob Mining is a blockchain based application that allows you to
              mine a blocks and receive NOOB coins. The miner will mine a block
              once a pending transaction is confirmed. You can also register a
              node to the network and have it mine blocks.
            </div>
          </div>
        </div>
      </div>

      {/* Mining Modes */}
      <div className="container mb-4 d-flex justify-content-center">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            value="manual"
            onClick={(e) => handleModeChange(e)}
            className={`${
              mode == "automatic"
                ? "btn btn-secondary btn-lg"
                : "btn btn-primary btn-lg"
            }`}
          >
            Manual
          </button>

          <button
            type="button"
            value="automatic"
            onClick={(e) => handleModeChange(e)}
            className={`${
              mode == "automatic"
                ? "btn btn-primary btn-lg"
                : "btn btn-secondary btn-lg"
            }`}
          >
            Automatic
          </button>
        </div>
      </div>

      {/* Manual Mode */}
      {mode === "manual" ? (
        <>
          {/* Set Mining Difficulty */}
          <div className="container mb-4 d-flex flex-column justify-content-center">
            <ButtonGroup>
              {miningDifficultyRange.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={radio.value ? "outline-primary" : "outline-danger"}
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => {
                    setRadioValue(e.currentTarget.value);
                    setSelectedDifficulty(e.currentTarget.value);
                  }}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
            <p className="lead">
              <strong>Select Mining Difficulty:</strong> Represents the number
              of prefixed zeros (ex: 00000) that be present to make the hash
              valid. A higher difficulty level requires more computing power to
              verify transactions and mine new coins.{" "}
            </p>
          </div>

          <div className="container w-75 d-flex justify-content-center pb-5">
            <table className="table" style={{ maxWidth: "60rem" }}>
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    Details
                  </th>
                  <th scope="col" className="text-center">
                    Location
                  </th>

                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {allNodes.map(
                  (node, index) =>
                    onlineNodes.includes(node.url) && (
                      <tr key={index}>
                        <td className="text-center">
                          <Link href="">
                            <a
                              onClick={() => {
                                handleClick(node.url);
                              }}
                            >
                              Node {index + 1}
                            </a>
                          </Link>
                        </td>
                        <td className="text-center">
                          <Link href={`${node.url}/blockchain`}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "blue" }}
                            >
                              {node.url}
                            </a>
                          </Link>
                        </td>

                        <td className="justify-content-center d-flex">
                          {!node.isMining ? (
                            <button
                              type="button"
                              className="btn btn-success btn-sm px-4"
                              value={node.url}
                              onClick={(e) => {
                                handleManualMineClick(e.target.value);
                              }}
                            >
                              Mine
                            </button>
                          ) : (
                            <Image
                              src="/images/mining-progress.gif"
                              alt="progrees-bar"
                              width="50px"
                              height="30px"
                            />
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Automatic Mode

        <>
          <div className="container w-75 d-flex justify-content-center">
            <Image
              src="/images/mining-progress-lg.gif"
              alt="progrees-bar"
              width="200px"
              height="200px"
            />
          </div>
          <div className="container w-75 d-flex justify-content-center">
            <p className="lead">
              <strong>Auto-Mining Enabled:</strong> The miner will automatically
              mine a block once a pending transaction is confirmed. The mining
              difficulty is fixed at 5. This means that the required block hash
              has to have 5 leading zeros to be considered valid.
            </p>
          </div>
        </>
      )}

      {/* Display Account Information */}
      <AccountInfo />
    </>
  );
}
