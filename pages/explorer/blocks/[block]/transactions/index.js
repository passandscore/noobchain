import Head from "next/head";
import Link from "next/link";
import styles from "../../../../../styles/BlockExplorer.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import SearchBar from "../../../../../Components/Explorer/SearchBar";

export const getStaticPaths = async () => {
  const blockData = await axios.get(`http://localhost:3001/blockchain`);

  const paths = blockData.data.chain.map((block) => ({
    params: {
      block: block.blockHash.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { block } = context.params;
  const transactionData = await axios.get(
    `http://localhost:3001/block/${block}/transactions`
  );
  return {
    props: {
      ...transactionData.data,
    },
  };
};

const BlockTransactions = (props) => {
  const [search, setSearch] = useState(false);
  const [blockValue, setBlockValue] = useState(0);
  console.log(props);
  const handleBlockchain = async () => {};

  useEffect(() => {
    let value = props.block.map((t) => t.value).reduce((a, b) => a + b);
    setBlockValue(value);
  }, []);

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
          <div className="card">
            <div className="card-header">
              Transactions: {props.block.length}
            </div>
            <div className="card-body">
              <blockquote className="blockquote mb-0">
                <p>Block Value: {blockValue} NOOB</p>
              </blockquote>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Txn Hash</th>
                <th scope="col">Block</th>
                <th scope="col">From</th>
                <th scope="col" style={{ paddingLeft: "3rem" }}>
                  To
                </th>
                <th scope="col">Value</th>
                <th scope="col">[Txn Fee]</th>
              </tr>
            </thead>
            <tbody>
              {props.block.length > 0 &&
                props.block.reverse().map((d, index) => (
                  <>
                    <tr key={index}>
                      <td>
                        <Link
                          href={`/explorer/transactions/${d.transactionDataHash.toString()}`}
                        >
                          {`${d.transactionDataHash.slice(0, 20)}...`}
                        </Link>
                      </td>
                      <td>{d.minedInBlockIndex}</td>
                      <td>
                        <Link href={`/explorer/addresses/${d.from.toString()}`}>
                          {`${d.from.slice(0, 20)}...`}
                        </Link>
                      </td>
                      <td>
                        <div className="d-flex">
                          <button
                            type="button"
                            className={`${
                              d.from === props.address
                                ? "btn btn-sm btn-warning"
                                : "btn btn-sm btn-success"
                            }`}
                            style={{
                              fontSize: "0.7rem",
                              marginRight: "0.5rem",
                              padding: "0.2rem",
                              width: "2rem",
                              borderRadius: "0.5rem",
                            }}
                          >
                            {`${d.from === props.address ? "OUT" : "IN"}`}
                          </button>
                          <Link href={`/explorer/addresses/${d.to.toString()}`}>
                            {`${d.to.slice(0, 20)}...`}
                          </Link>
                        </div>
                      </td>
                      <td>{d.value}</td>
                      <td>{d.fee}</td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BlockTransactions;
