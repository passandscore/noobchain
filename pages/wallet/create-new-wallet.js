import Head from "next/head";
import Image from "next/image";
import MenuBar from "../../Components/Wallet/MenuBar";

export default function CreateNewWallet() {
  return (
    <>
      <Head>
        <title>NOOB Wallet | New Wallet</title>
      </Head>

      <MenuBar />
      <section id="viewHome">
        <h1>Create New Wallet</h1>
      </section>
    </>
  );
}
