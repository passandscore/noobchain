import Head from "next/head";
import styles from "../styles/BlockExplorer.module.css";
import axios from "axios";

export default function Home() {
  const handleBlockchain = async () => {
    const blockchain = await axios.get("http://localhost:3001/blockchain");
    console.log(blockchain);
  };

  const handleWallet = async () => {
    console.log("wallet");
  };
  return (
    <>
      <Head>
        <title>NOOB | Block Explorer</title>
      </Head>
      <div className={styles.background}></div>
      <div
        className="container position-relative "
        style={{
          bottom: "11rem",
          zIndex: "2",
        }}
      >
        <div className={styles.landingText}>
          <label htmlFor="basic-url" className="text-white py-2 fs-5">
            Noobchain PoW Testnet Explorer
          </label>
          <div className="input-group mb-3" style={{ height: "25px" }}>
            <div className="input-group-prepend"></div>
            <input
              type="text"
              className="form-control form-control-lg"
              style={{
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              }}
              id="basic-url"
              placeholder="Search by Address / Txn Hash / Block Hash"
            />
            <span
              className="input-group-text bg-info px-4"
              id="basic-addon3"
              style={{
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                color="#ffffff"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
                cursor="pointer"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div
              className="card shadow-lg mb-5"
              style={{ borderRadius: "10px", top: "3rem", height: "30rem" }}
            >
              {/* BLOCKS */}
              <h5
                className="card-header bg-light"
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                Latest Blocks
              </h5>
              <div className="card-body">
                <div className="row">
                  {/* col 1 */}
                  <div className="col-md-3">
                    <div>
                      <div className=" d-flex align-items-center">
                        <div className="">
                          <div
                            className="border rounded text-secondary  fs-5"
                            style={{
                              backgroundColor: "#e2e7e9",
                              paddingRight: "0.4rem",
                              paddingLeft: "0.4rem",
                              marginTop: "0.4rem",
                            }}
                          >
                            Bk
                          </div>
                        </div>
                        <div className=" px-2">
                          <div className=" text-secondary">
                            <a href="#" className={styles.noDecor}>
                              21535012
                            </a>
                          </div>
                          <div
                            className=" text-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            5 secs ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* col 2 */}
                  <div className="col-md-6">
                    <div className="px-2">
                      <div className="text-secondary">
                        Mined By{" "}
                        <a href="#" className={styles.noDecor}>
                          0xbe188d6641e8b680743...
                        </a>
                      </div>
                      <div className="  text-secondary">
                        <a href="#" className={styles.noDecor}>
                          2 txns
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* col 3 */}
                  <div className="col-md-3">
                    <div className=" ">
                      <div className="  d-flex justify-content-end ">
                        0.00128 NOOB
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>

                <hr />
              </div>
              <div
                className="card-footer  bg-primary  text-light  font-weight-bold text-center"
                style={{
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  cursor: "pointer",
                }}
              >
                View all Blocks
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div
              className="card shadow-lg mb-5"
              style={{
                borderRadius: "10px",
                top: "3rem",
                height: "30rem",
              }}
            >
              {/* TRANSACTIONS */}
              <h5
                className="card-header"
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                Latest Transactions
              </h5>
              <div className="card-body">
                <div className="row">
                  {/* col 1 */}
                  <div className="col-md-3">
                    <div>
                      <div className=" d-flex align-items-center">
                        <div className="">
                          <div
                            className="border rounded-circle text-secondary  fs-5"
                            style={{
                              backgroundColor: "#e2e7e9",
                              paddingRight: "0.4rem",
                              paddingLeft: "0.4rem",
                              marginTop: "0.4rem",
                            }}
                          >
                            Tx
                          </div>
                        </div>
                        <div className=" px-2">
                          <div className=" text-secondary">
                            <a href="#" className={styles.noDecor}>
                              0xa51da5f...
                            </a>
                          </div>
                          <div
                            className=" text-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            5 secs ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* col 2 */}
                  <div className="col-md-6">
                    <div className="px-4">
                      <div className="text-secondary">
                        From:{" "}
                        <a href="#" className={styles.noDecor}>
                          0x83s88d6641e8b680743...
                        </a>
                      </div>
                      <div className="text-secondary">
                        To:{" "}
                        <a href="#" className={styles.noDecor}>
                          0x83s88d6641e8b680743...
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* col 3 */}
                  <div className="col-md-3">
                    <div className=" ">
                      <div className="  d-flex justify-content-end ">
                        0.00128 NOOB
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>

                <hr />
              </div>
              <div
                className="card-footer  bg-primary  text-light  font-weight-bold text-center"
                style={{
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  cursor: "pointer",
                }}
              >
                View all Transactions
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
