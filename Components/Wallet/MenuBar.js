import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Wallet.module.css";

const Navbar = () => {
  return (
    <>
      <div
        className={styles.background}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <p className="btn fs-5">
          <Link href="/wallet">
            <a className="nav-link text-info fs-5">Home</a>
          </Link>
        </p>
        <p className="btn fs-5">
          <Link href="/wallet/create-new-wallet">
            <a className="nav-link text-info fs-5">Create</a>
          </Link>
        </p>
        <p className="btn fs-5">
          <Link href="/wallet/open-existing-wallet">
            <a className="nav-link text-info fs-5"> Open</a>
          </Link>
        </p>
        <p className="btn fs-5">
          <Link href="/wallet/account-balance">
            <a className="nav-link text-info fs-5">Balance</a>
          </Link>
        </p>
        <p className="btn fs-5">
          <Link href="/wallet/send-transaction">
            <a className="nav-link text-info fs-5"> Send</a>
          </Link>
        </p>
        <p className="btn fs-5">
          <Link href="/wallet">
            <a className="nav-link text-info fs-5"> Logout</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Navbar;
