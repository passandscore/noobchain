import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { constSelector } from "recoil";

export default function Home() {
  const handleBlockchain = async () => {
    const blockchain = await axios.get("http://localhost:3001/blockchain");
    console.log(blockchain);
  };

  const handleWallet = async () => {
    console.log("wallet");
  };
  return (
    <div className="d-flex justify-content-center">
      <h1 className="display-4">Block Explorer</h1>
    </div>
  );
}
