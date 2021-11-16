import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Wallet.module.css";

export default function Wallet() {
  return (
    <>
      <Head>
        <title>NOOB | Faucet</title>
      </Head>
      <div
        className={styles.background}
        style={{ display: "flex", justifyContent: "center" }}
      ></div>
      <section id="viewHome">
        <div className="mt-5 pt-3">
          <div className="container" style={{ width: "35rem" }}>
            {/* Card */}
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="fs-5">NoobChain Faucet</div>
                <div className="pt-1" style={{ cursor: "pointer" }}>
                  Donate?
                </div>
              </div>
              <div className="card-body">
                <div className="input-group mb-3 p-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      Recipient
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="basic-url"
                    aria-describedby="basic-addon3"
                    placeholder="0xx..."
                  />
                </div>
                <div className="input-group mb-3 p-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      Node URL
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="basic-url"
                    aria-describedby="basic-addon3"
                    value="http://localhost:3001"
                  />
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    id="buttonGenerateNewWallet"
                    value="Generate Now"
                    className="btn btn-primary btn-lg mt-3 w-100"
                  >
                    Submit
                  </button>
                </div>
                {/* Results */}
                <div className="text-center">
                  <p className="fs-5 m-0">
                    We sent{" "}
                    <span className="fs-3 text-success">0.34343434</span> coins
                    to address
                  </p>

                  <p className="fs-5 m-0">
                    <a href="#" style={{ textDecoration: "none" }}>
                      0xdfsdfsfsdfsdflkjsflsd8fe3h98r32hr9832
                    </a>
                  </p>
                  <p className="fs-5">
                    tx:{" "}
                    <a
                      style={{ fontSize: "16px", textDecoration: "none" }}
                      href="#"
                    >
                      90093840934803j4lk34jh389hjr03u434u3
                    </a>
                  </p>
                  <button
                    type="button"
                    id="buttonGenerateNewWallet"
                    className="btn btn-primary btn-lg  w-100"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
