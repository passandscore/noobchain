import Head from "next/head";
import Link from "next/link";
import styles from "../../../styles/BlockExplorer.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import SearchBar from "../../../Components/Explorer/SearchBar";

export const getStaticPaths = async () => {
  const tranData = await axios.get(`http://localhost:3001/all-transactions`);

  const paths = tranData.data.map((tran) => ({
    params: {
      transaction: tran.transactionDataHash,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { transaction } = context.params;
  const tranData = await axios.get(
    `http://localhost:3001/transaction/${transaction}`
  );
  return {
    props: {
      transaction: tranData.data,
    },
  };
};

const TransactionDetails = ({ transaction }) => {
  const [search, setSearch] = useState(true);
  const [trans, setTrans] = useState(transaction.transaction.transaction);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        name: "Transaction Hash:",
        value: `${trans.transactionDataHash}`,
      },
      {
        name: "Status:",
        value: `${trans.transferSuccessful ? "Success" : "Pending"}`,
      },
      {
        name: "Block:",
        value: `${trans.minedInBlockIndex}`,
      },
      {
        name: "Timestamp:",
        value: `${trans.dateCreated}`,
      },
      {
        name: "From:",
        value: `${trans.from}`,
        link: `/explorer/addresses/${trans.from}`,
      },
      {
        name: "To:",
        value: `${trans.to}`,
        link: `/explorer/addresses/${trans.to}`,
      },
      { name: "Value:", value: `${trans.value}` },
      { name: "Transaction Fee:", value: `${trans.fee}` },
      { name: "Data:", value: `${trans.data}` },
    ]);
  }, []);

  const handleBlockchain = async () => {};

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
        <SearchBar handleSearch={handleBlockchain} />
        <div className="container" style={{ marginTop: "8rem" }}>
          <h4 className="display-5">Transaction Details</h4>
          <div className="container p-2 border rounded-3">
            <table className="table ">
              <tbody>
                {data &&
                  data.map((d, index) => (
                    <tr key={index}>
                      <td style={{ paddingRight: "10rem" }}> {d.name}</td>
                      {d.link ? (
                        <td>
                          <Link href={`${d.link}`}>{d.value}</Link>
                        </td>
                      ) : (
                        <td>{d.value}</td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
