import styles from "../../styles/BlockExplorer.module.css";

const LastestTransactions = ({ transactions }) => {
  const trimAddress = (address) => {
    const start = address.split("").slice(0, 14).join("");
    const end = address.split("").slice(-6).join("");
    return `${start}...${end}`;
  };

  console.log(transactions);
  return (
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
        <div className="card-body" style={{ overflowY: "auto" }}>
          {transactions &&
            transactions.map((tran, index) => (
              <div key={index}>
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
                              {`${tran.transactionDataHash
                                .split("")
                                .slice(0, 8)
                                .join("")}...`}
                            </a>
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
                          {trimAddress(tran.from)}
                        </a>
                      </div>
                      <div className="text-secondary">
                        To:{" "}
                        <a href="#" className={styles.noDecor}>
                          {trimAddress(tran.to)}
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* col 3 */}
                  <div className="col-md-3">
                    <div className=" ">
                      <div className="  d-flex justify-content-end ">
                        {`${tran.value} NOOB`}
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>

                <hr />
              </div>
            ))}
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
  );
};

export default LastestTransactions;
