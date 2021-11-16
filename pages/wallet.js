import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Wallet.module.css";

import axios from "axios";
import MenuBar from "../Components/Wallet/MenuBar";
import image from "next/image";

export default function Wallet() {
  return (
    <>
      <Head>
        <title>NOOB | Wallet</title>
      </Head>

      <MenuBar />
      <section id="viewHome">
        <div className="mt-5 pt-3">
          <h1 className="display-1 pb-5 text-center">Blockchain Wallet</h1>

          <div className="d-flex justify-content-center">
            <Image
              src="/images/HeaderWallet-1.png"
              alt="Wallet"
              width="800px"
              height="400px"
              className="img-fluid"
            />
          </div>
        </div>
      </section>
    </>
  );
}
