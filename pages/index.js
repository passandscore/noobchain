import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Wallet.module.css";

export default function Wallet() {
  return (
    <>
      <Head>
        <title>NOOB | Wallet</title>
      </Head>

      <div
        className={styles.background}
        style={{ display: "flex", justifyContent: "center" }}
      ></div>
      <div className="container" style={{ marginTop: "10rem" }}>
        <div className="jumbotron">
          <div className="container text-center text-lg-left">
            <div className="row">
              <div className="col-lg-8">
                <h1 className="display-4">
                  A simple yet complete blockchain solution for everyone.
                </h1>
                <p className="lead">
                  Noobchain is a peer-to-peer Internet currency that enables
                  payments to anyone in my localhost world. Noobchain is an open
                  source, potentially global payment network that is fully
                  decentralized without any central authorities....I think.
                </p>
                <span className="text-center d-inline-block">
                  <Link href="/wallet">
                    <a
                      className="btn btn-primary btn-lg w-100"
                      href="#"
                      role="button"
                    >
                      Try it free
                    </a>
                  </Link>
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    No credit card required
                  </p>
                </span>
              </div>
              <div className="col-lg-4 align-items-center d-flex">
                <Image
                  src="/images/blocks-in-hand.jpg"
                  alt="blocks-in-hand"
                  className="img-fluid"
                  width="1200px"
                  height="800px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
