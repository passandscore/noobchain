import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Wallet.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { nodeList, defaultNode } from "../recoil/atoms";
import AccountInfo from "../Components/Wallet/AccountInfo";
import { Modal, Button } from "react-bootstrap";

export default function Nodes() {
  const [currentNodes, setCurrentNodes] = useRecoilState(nodeList);
  const [selectedNode, setSelectedNode] = useState("");
  const [updateUserNode, setUpdateUserNode] = useRecoilState(defaultNode);
  const [show, setShow] = useState(false);
  const [nodeInfo, setNodeInfo] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [allNodes, setAllNodes] = useState([
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
  ]);

  const addNode = async (nodeUrl) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = { newNodeUrl: nodeUrl };

    const register = await axios.post(
      "http://localhost:3001/register-and-broadcast-node",
      body,
      config
    );

    const result = register.data.message;

    if (result) {
      const nodeNum = nodeUrl.split("").pop();
      const msg = `Node ${nodeNum} registered with network successfully`;

      toast.success(msg, {
        position: "bottom-right",
        theme: "colored",
      });

      //Update the status of the node on the view
      if (!currentNodes.includes(nodeUrl)) {
        console.log("Node not in array");
        setCurrentNodes([...currentNodes, nodeUrl]);
      }
    } else {
      toast.error("Node unable to connect", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const removeNode = async (nodeUrl) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = { oldNodeURL: nodeUrl };

    const register = await axios.post(
      "http://localhost:3001/unregister-and-broadcast-node",
      body,
      config
    );

    const result = register.data.message;

    if (result) {
      const nodeNum = nodeUrl.split("").pop();
      const msg = `Node ${nodeNum} successfully removed from network`;

      toast.success(msg, {
        position: "bottom-right",
        theme: "colored",
      });

      //Update the status of the node on the view
      if (currentNodes.includes(nodeUrl)) {
        setCurrentNodes(currentNodes.filter((node) => node !== nodeUrl));
      }

      // Check if the node is the default node
      if (updateUserNode === nodeUrl) {
        setUpdateUserNode("http://localhost:3001");
      }
    } else {
      toast.error("Node unable to connect", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  const handleNodeChange = (e) => {
    const newNode = e.target.value;
    setSelectedNode(newNode);
    setUpdateUserNode(newNode);
    toast.info(`Now connected to ${newNode}`, {
      position: "bottom-right",
      theme: "colored",
    });
  };

  const handleClick = async (nodeUrl) => {
    const result = await axios.get(`${nodeUrl}/info`);
    setNodeInfo(result.data);
    handleShow();
  };
  return (
    <>
      <Head>
        <title>NOOB | Nodes</title>
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
        style={{ display: "flex", justifyContent: "center" }}
      ></div>

      {/* Select Default Node */}
      <div className="container mt-5" style={{ width: "60rem" }}>
        <div className="jumbotron">
          <h1 className="display-4">Hello, Noob!</h1>
          <p className="lead">
            Noobchain is a peer-to-peer blockchain network that enables the use
            of a decentralized ledger to store, share, and verify information.
          </p>
          <hr className="my-4" />
          <p>Select your default node to be used for all transactions.</p>
          {/* Select Node Url */}
          <div className="input-group mb-3 p-2">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                Node Url
              </label>
            </div>
            <select
              value={selectedNode}
              className="form-control"
              id="inputGroupSelect01"
              onChange={(e) => {
                handleNodeChange(e);
              }}
            >
              {currentNodes &&
                currentNodes.map((node, index) => (
                  <option key={index} value={node}>
                    {node}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Node to Network */}
      <div className="container w-75 d-flex justify-content-center">
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
                Status
              </th>
              <th scope="col" className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="text-center">
                <Link href="">
                  <a
                    onClick={() => {
                      handleClick("http://localhost:3001");
                    }}
                  >
                    Node 1
                  </a>
                </Link>
              </td>
              <td className="text-center">
                <Link href="http://localhost:3001/blockchain">
                  <a target="_blank" rel="noopener noreferrer">
                    http://localhost:3001
                  </a>
                </Link>
              </td>
              <td className="text-center">Online</td>
              <td className="justify-content-center d-flex">Always On</td>
            </tr>

            {allNodes.map((node, index) => (
              <tr key={index}>
                <td className="text-center">
                  <Link href="">
                    <a
                      onClick={() => {
                        handleClick(node);
                      }}
                    >
                      Node {index + 2}
                    </a>
                  </Link>
                </td>
                <td className="text-center">
                  <Link href={`${node}/blockchain`}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue" }}
                    >
                      {node}
                    </a>
                  </Link>
                </td>
                <td className="text-center">
                  {currentNodes.includes(node) ? "Online" : "-"}
                </td>
                <td className="justify-content-center d-flex">
                  {!currentNodes.includes(node) ? (
                    <button
                      type="button"
                      className="btn btn-success btn-sm px-4"
                      value={node}
                      onClick={(e) => {
                        addNode(e.target.value);
                      }}
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mx-2 px-4"
                      value={node}
                      onClick={(e) => {
                        removeNode(e.target.value);
                      }}
                    >
                      Stop
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Account Information */}
      <AccountInfo />
    </>
  );
}
