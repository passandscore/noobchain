import Head from "next/head";
import Image from "next/image";
import MenuBar from "../../Components/Wallet/MenuBar";

export default function OpenExistingWallet() {
  return (
    <>
      <Head>
        <title>NOOB Wallet | Open Wallet</title>
      </Head>

      <MenuBar />
      <section id="viewHome">
        <h1>Open Wallet</h1>
      </section>
    </>
  );
}
