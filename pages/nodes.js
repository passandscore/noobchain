import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Wallet.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { nodeList } from "../recoil/atoms";

export default function Nodes() {
  const [currentNodes, setCurrentNodes] = useRecoilState(nodeList);
  const [nodesOnline, setNodesOnline] = useState([]);
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
        position: "top-right",
        theme: "colored",
      });

      //Update the status of the node on the view
      if (!currentNodes.includes(nodeUrl)) {
        console.log("Node not in array");
        // setNodesOnline([...nodesOnline, nodeUrl]);
        setCurrentNodes([...currentNodes, nodeUrl]);
        console.log(nodesOnline);
      }
    } else {
      toast.error("Node unable to connect", {
        position: "top-right",
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
        position: "top-right",
        theme: "colored",
      });

      //Update the status of the node on the view
      if (currentNodes.includes(nodeUrl)) {
        setCurrentNodes(currentNodes.filter((node) => node !== nodeUrl));
      }
    } else {
      toast.error("Node unable to connect", {
        position: "top-right",
        theme: "colored",
      });
    }
  };
  return (
    <>
      <Head>
        <title>NOOB | Nodes</title>
      </Head>

      <ToastContainer position="top-center" pauseOnFocusLoss={false} />

      <div
        className={styles.background}
        style={{ display: "flex", justifyContent: "center" }}
      ></div>

      <div className="container w-75 d-flex justify-content-center">
        <table className="table w-75">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Location</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Node 1</td>
              <td>http://localhost:3001</td>
              <td>Online</td>
              <td className="justify-content-center d-flex">Always On</td>
            </tr>

            {allNodes.map((node, index) => (
              <tr key={index}>
                <td>Node {index + 2}</td>
                <td>{node}</td>
                <td>{currentNodes.includes(node) ? "Online" : "Offline"}</td>
                <td className="justify-content-center d-flex">
                  {!currentNodes.includes(node) ? (
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
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
                      className="btn btn-danger btn-sm mx-2"
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
    </>
  );
}
