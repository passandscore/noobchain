import Head from "next/head";
import styles from "../../styles/BlockExplorer.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import SearchBar from "../../Components/Explorer/SearchBar";
import LatestBlocks from "../../Components/Explorer/LatestBlocks";
import LastestTransactions from "../../Components/Explorer/LastestTransactions";

export default function Home() {
  const [blockchain, setBlockchain] = useState(null);
  const [blocks, setblocks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // All blockchain data is fetched from the node
    axios.get(`http://localhost:3001/blockchain`).then((res) => {
      setBlockchain(res.data.chain);

      let lastestBlocks = [];

      // Construct lastest blocks
      res.data.chain.forEach((b) => {
        let block = {};
        block.blockHash = b.blockHash;
        block.transactionCount = b.transactions.length;
        block.value = b.transactions
          .map((t) => t.value)
          .reduce((a, b) => a + b);
        block.minedBy = b.minedBy;
        lastestBlocks.push(block);
      });
      lastestBlocks = lastestBlocks.reverse().slice(0, 10);
      setblocks(lastestBlocks);
    });

    axios.get(`http://localhost:3001/all-transactions`).then((res) => {
      console.log(res.data);
      if (res.data.length > 0) {
        setTransactions(res.data.reverse().slice(0, 10));
      }
    });
  }, []);

  const handleBlockchain = async () => {};

  const handleWallet = async () => {
    console.log("wallet");
  };
  return (
    <>
      <Head>
        <title>NOOB | Block Explorer</title>
      </Head>
      <div className={styles.background}></div>
      <p className="text-white">{blocks.blockHash}</p>
      {/* Background */}
      <div
        className="container position-relative "
        style={{
          bottom: "11rem",
          zIndex: "2",
        }}
      >
        <SearchBar handleSearch={handleBlockchain} />

        <div className="row">
          <LatestBlocks blocks={blocks} />
          <LastestTransactions transactions={transactions} />
        </div>
      </div>
    </>
  );
}
