const express = require("express");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");
const port = process.argv[2];
const rp = require("request-promise");
const cors = require("cors");
const { StatusCodes } = require("http-status-codes");

const nodeAddress = uuid().split("-").join("");

const noobchain = new Blockchain();

let node = {
  nodeId:
    new Date().getTime().toString(16) + Math.random().toString(16).substring(2),
  host: noobchain.currentNodeUrl.split("/")[2],
  port: noobchain.currentNodeUrl.split(":")[2],
  selfUrl: noobchain.currentNodeUrl,
  peers: noobchain.networkNodes,
  // chain: noobchain.chain,
  // chainId: node.chain.blocks[0].blockHash,
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get("/blockchain", function (req, res) {
  res.send(noobchain);
});

/**
 * @notice - Displays statistics about the node
 */
app.get("/info", (req, res) => {
  res.json({
    about: "NoobChain/v1",
    nodeUrl: noobchain.currentNodeUrl,
    peers: noobchain.networkNodes.length,
    difficulty: noobchain.difficulty,
    blocks: noobchain.chain.length,
    // cumulativeDifficulty: noobchain.chain.calcCumulativeDifficulty(),
    // confirmedTransactions: noobchain.chain.getConfirmedTransactions().length,
    pendingTransactions: noobchain.pendingTransactions.length,
  });
});

//========================= Transactions =========================

/**
 * @notice - Displays the transaction history of a specific address
 * @param address - Address of a wallet
 */
app.get("/address/:address/transactions", (req, res) => {
  let address = req.params.address;
  let tranHistory = noobchain.getTransactionHistory(address);
  res.json(tranHistory);
});

/**
 * @dev -  https://www.npmjs.com/package/http-status-codes
 * @notice - Displays the balance of a specific address
 * @param address - Address of a wallet
 */
app.get("/address/:address/balance", (req, res) => {
  let address = req.params.address;
  let balance = noobchain.getAccountBalance(address);
  if (balance.errorMsg) res.status(StatusCodes.NOT_FOUND);
  res.json(balance);
});

// adds a transaction to a nodes pending transactions
app.post("/transaction", function (req, res) {
  const newTransaction = req.body;
  const blockIndex =
    noobchain.addTransactionToPendingTransactions(newTransaction);
  res.json({
    message: `Transaction will be added in block ${blockIndex}`,
  });
});

// creates a new transaction
app.post("/transaction/broadcast", function (req, res) {
  const newTransaction = noobchain.addTransaction(req.body);

  console.log(newTransaction);
  if (newTransaction.errorMsg) {
    res.json({ error: newTransaction.errorMsg });
    return;
  }
  // noobchain.addTransactionToPendingTransactions(newTransaction);

  if (newTransaction.transactionDataHash) {
    // Added a new pending transaction --> broadcast it to all known peers

    const requestPromises = [];
    noobchain.networkNodes.forEach((node) => {
      const requestOptions = {
        uri: `${node}/transaction`,
        method: "POST",
        body: newTransaction,
        json: true,
      };

      requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
      .then(() =>
        res.json({
          message: "Transaction created and broadcasted",
          transactionDataHash: newTransaction.transactionDataHash,
        })
      )
      .catch((err) => res.status(400).json({ error: err.message }));
  } else res.status(StatusCodes.BAD_REQUEST).json(newTransaction);
});

// returns all blockchain transactions
app.get("/all-transactions", function (req, res) {
  res.json(noobchain.getAllTransactions());
});

//========================= Mining =========================

// app.get("/mine", function (req, res) {
//   const lastBlock = noobchain.getLastBlock();
//   const previousBlockHash = lastBlock.hash;
//   const currentBlockData = {
//     transactions: noobchain.pendingTransactions,
//     index: lastBlock.index + 1,
//   };
//   const nonce = noobchain.proofOfWork(
//     previousBlockHash,
//     currentBlockData,
//     noobchain.difficulty
//   );

//   const blockHash = noobchain.hashBlock(
//     previousBlockHash,
//     currentBlockData,
//     nonce
//   );

//   const newBlock = noobchain.addBlock(nonce, previousBlockHash, blockHash);
//   // broadcast the new block to other nodes
//   const requestPromises = [];
//   noobchain.networkNodes.forEach((node) => {
//     const requestOptions = {
//       uri: `${node}/receive-new-block`,
//       method: "POST",
//       body: { newBlock },
//       json: true,
//     };

//     requestPromises.push(rp(requestOptions));
//   });

//   Promise.all(requestPromises)
//     .then(() => {
//       // Broadcast miner reward transaction to all nodes
//       const requestOptions = {
//         uri: `${noobchain.currentNodeUrl}/transaction/broadcast`,
//         method: "POST",
//         body: {
//           sender: "00",
//           recipient: nodeAddress,
//           amount: noobchain.minerReward,
//         },
//         json: true,
//       };

//       return rp(requestOptions);
//     })
//     .then(() =>
//       res.json({
//         message: "New block mined and broadcasted successfully",
//         block: newBlock,
//       })
//     )
//     .catch((err) => res.status(400).json({ error: err.message }));
// });

// app.post("/receive-new-block", function (req, res) {
//   const newBlock = req.body.newBlock;
//   const lastBlock = noobchain.getLastBlock();
//   const correctHash = lastBlock.hash === newBlock.previousBlockHash;
//   const correctIndex = lastBlock.index + 1 === newBlock.index;

//   if (correctHash && correctIndex) {
//     noobchain.chain.push(newBlock);
//     noobchain.pendingTransactions = [];
//     res.json({
//       message: "New block received and accepted",
//       newBlock,
//     });
//   } else {
//     res.json({
//       message: "New block rejected",
//       newBlock,
//     });
//   }
// });

//========================= Mining =========================
app.post("/mine-next-block", function (req, res) {
  const { minerAddress, difficulty } = req.body;
  const newBlock = noobchain.mineNextBlock(minerAddress, difficulty);

  // broadcast the new block to other nodes
  const requestPromises = [];
  noobchain.networkNodes.forEach((node) => {
    const requestOptions = {
      uri: `${node}/receive-new-block`,
      method: "POST",
      body: { newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(() => {
      res.json({
        message: "New block mined and broadcasted successfully",
        block: newBlock,
      });
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.post("/receive-new-block", function (req, res) {
  const block = noobchain.extendChain(req.body.newBlock);
  if (!block.errorMsg) {
    res.json({
      message: "New block received and accepted",
      block,
    });
  } else {
    res.json({
      message: "New block rejected",
      block,
    });
  }
});

/**  ========================= Register Nodes =========================
 * Step 1) A new node will call the /register-and-broadcast-node endpoint of an existing node.
 * That node will be registered within the current node then "broadcasted" to all other nodes.
 * Step 2) The existing node will initate the broadcast by calling /register-node of all nodes in the network.
 * Step 3) Once broadcast is complete, the exisiting node will call the /register-nodes-bulk endpoint on the new node.
 * This will give the new node an updated list of all nodes in the network.
 */
app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;

  // Step 1)
  if (noobchain.networkNodes.indexOf(newNodeUrl) == -1) {
    noobchain.networkNodes.push(newNodeUrl);
  }

  // Step 2)
  const regNodesPromises = [];
  noobchain.networkNodes.forEach((networkNodesUrl) => {
    const requestOptions = {
      uri: networkNodesUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };

    regNodesPromises.push(rp(requestOptions));
  });

  // Step 3)
  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [
            ...noobchain.networkNodes,
            noobchain.currentNodeUrl,
          ],
          pendingTransactions: noobchain.pendingTransactions,
        },
        json: true,
      };

      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({
        message: "New node registered with network successfully",
      });
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent =
    noobchain.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = noobchain.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    noobchain.networkNodes.push(newNodeUrl);
  res.json({
    message: "New node registered successfully",
  });
});

app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  const pendingTransactions = req.body.pendingTransactions;

  allNetworkNodes.forEach((networkNodesUrl) => {
    const nodeNotAlreadyPresent =
      noobchain.networkNodes.indexOf(networkNodesUrl) == -1;
    const notCurrentNode = noobchain.currentNodeUrl !== networkNodesUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      noobchain.networkNodes.push(networkNodesUrl);
  });
  // update pending transactions
  noobchain.pendingTransactions = pendingTransactions;
  res.json({
    message: "Bulk registration successful",
  });
});

/**  ========================= Unregister Nodes =========================
 * Step 1) A new node will call the /register-and-broadcast-node endpoint of an existing node.
 * That node will be broadcasted to all other nodes and removed from the network.
 * Step 2) The current node will initate then remove the old node from its database.
 */
app.post("/unregister-and-broadcast-node", function (req, res) {
  const oldNodeURL = req.body.oldNodeURL;

  // Step 1)
  const removeNodePromise = [];
  noobchain.networkNodes.forEach((networkNodesUrl) => {
    const requestOptions = {
      uri: networkNodesUrl + "/unregister-node",
      method: "POST",
      body: { oldNodeURL: oldNodeURL },
      json: true,
    };

    removeNodePromise.push(rp(requestOptions));
  });

  // Step 2)
  Promise.all(removeNodePromise)
    .then(() => {
      if (noobchain.networkNodes.includes(oldNodeURL)) {
        noobchain.networkNodes = noobchain.networkNodes.filter(
          (node) => node !== oldNodeURL
        );
      }

      res.json({
        message: "Node removed from network successfully",
      });
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.post("/unregister-node", function (req, res) {
  if (noobchain.currentNodeUrl === req.body.oldNodeURL) {
    noobchain.networkNodes = [];
  } else {
    const oldNodeURL = req.body.oldNodeURL;
    noobchain.networkNodes = noobchain.networkNodes.filter(
      (node) => node !== oldNodeURL
    );
  }
  // update pending transactions
  noobchain.pendingTransactions = [];
  res.json({
    message: "Node removed successfully",
  });
});

//========================= Consensus =========================

// Used to correct the chain if a node has the wrong chain data.
app.get("/consensus", function (req, res) {
  const requestPromises = [];

  // get all network nodes and make a request to each one
  noobchain.networkNodes.forEach((networkNodesUrl) => {
    const requestOptions = {
      uri: networkNodesUrl + "/blockchain",
      method: "GET",
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then((blockchains) => {
      // check if the length of the blockchains is greater than our current node blockchain
      const currentChainLength = noobchain.chain.length;
      let maxChainLength = currentChainLength;
      let newLongestChain = null;
      let newPendingTransactions = null;

      blockchains.forEach((blockchain) => {
        if (blockchain.chain.length > maxChainLength) {
          maxChainLength = blockchain.chain.length;
          newLongestChain = blockchain.chain;
          newPendingTransactions = blockchain.pendingTransactions;
        }
      });

      if (
        !newLongestChain ||
        (newLongestChain && !noobchain.chainIsValid(newLongestChain))
      ) {
        res.json({
          message: "Current chain has not been replaced",
          chain: noobchain.chain,
        });
      } else {
        noobchain.chain = newLongestChain;
        noobchain.pendingTransactions = newPendingTransactions;
        res.json({
          message: "This chain has been replaced",
          chain: noobchain.chain,
        });
      }
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

//========================= Block Explorer =========================
app.get("/block/:blockHash", (req, res) => {
  const blockHash = req.params.blockHash;
  const correctBlock = noobchain.getBlock(blockHash);
  res.json({ block: correctBlock });
});

app.get("/transaction/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  const transactionData = noobchain.getTransaction(transactionId);
  res.json({ transaction: transactionData });
});

app.get("/address/:address", (req, res) => {
  const address = req.params.address;
  const addressData = noobchain.getAddressData(address);
  res.json({ addressData: addressData });
});

app.get("/block-explorer", (req, res) => {
  res.sendFile("./block-explorer/index.html", { root: __dirname });
});

app.get("/wallet", (req, res) => {
  res.sendFile("./wallet/wallet.html", { root: __dirname });
});
//========================= Server =========================
app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
