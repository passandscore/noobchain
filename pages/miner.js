import Head from "next/head";
import styles from "../styles/Wallet.module.css";

export default function Miner() {
  return (
    <>
      <Head>
        <title>NOOB | Faucet</title>
      </Head>
      <div
        className={styles.background}
        style={{ display: "flex", justifyContent: "center" }}
      ></div>
      <h1 className="display-5">Miner</h1>;
    </>
  );
}
