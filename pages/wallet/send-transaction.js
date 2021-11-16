import Head from "next/head";
import Image from "next/image";
import MenuBar from "../../Components/Wallet/MenuBar";

export default function SendTransaction() {
  return (
    <>
      <Head>
        <title>NOOB Wallet | Send Transaction</title>
      </Head>

      <MenuBar />
      <section id="viewHome">
        <h1>Send Transaction</h1>
      </section>
    </>
  );
}
