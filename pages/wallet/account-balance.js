import Head from "next/head";
import Image from "next/image";
import MenuBar from "../../Components/Wallet/MenuBar";

export default function AccountBalances() {
  return (
    <>
      <Head>
        <title>NOOB Wallet | Balances</title>
      </Head>

      <MenuBar />
      <section id="viewHome">
        <h1>Account Balances</h1>
      </section>
    </>
  );
}
