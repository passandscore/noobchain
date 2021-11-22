import Head from "next/head";
import styles from "../../../styles/BlockExplorer.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import SearchBar from "../../../Components/Explorer/SearchBar";

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
  const blockData = await axios.get(`http://localhost:3001/block/${block}`);
  return {
    props: {
      ...blockData.data,
    },
  };
};

const BlockDetails = ({ block }) => {
  const [search, setSearch] = useState(true);
  // const [trans, setTrans] = useState(transaction.transaction.transaction);
  // const [isSuccessful, setIsSuccessful] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    // if (trans.transferSuccessful) {
    //   setIsSuccessful("Success");
    // } else {
    //   setIsSuccessful("Pending");
    // }
    setData([
      { name: "Block Height:", value: block.index },
      { name: "Timestamp:", value: block.dateCreated },
      { name: "Transactions:", value: `${block.transactions.length}` },
      { name: "Mined by:", value: `${block.minedBy}` },
      { name: "Block Reward:", value: `${block.blockReward}` },
      { name: "Difficulty:", value: `${block.difficulty}` },
      { name: "Block Hash:", value: `${block.blockHash}` },
      { name: "BlockDataHash:", value: `${block.blockDataHash}` },
      { name: "Nonce:", value: `${block.nonce}` },
      // { name: "Data:", value: `${trans.data}` },
    ]);
    console.log(block);
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
          <h4 className="display-5">{`Block #${block.index}`}</h4>
          <div className="container p-2 border rounded-3">
            <table className="table ">
              <tbody>
                {data &&
                  data.map((d, index) => (
                    <>
                      <tr key={index}>
                        <td style={{ paddingRight: "10rem" }}> {d.name}</td>

                        <td>{d.value}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockDetails;
