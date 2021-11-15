const express = require("express");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");
const port = process.argv[2];
const rp = require("request-promise");
const cors = require("cors");

const nodeAddress = uuid().split("-").join("");

const bitcoin = new Blockchain();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get("/blockchain", function (req, res) {
  res.send(bitcoin);
});

//========================= Transactions =========================

// adds a transaction to a nodes pending transactions
app.post("/transaction", function (req, res) {
  const newTransaction = req.body;
  const blockIndex =
    bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({
    message: `Transaction will be added in block ${blockIndex}`,
  });
});

// creates a new transaction
app.post("/transaction/broadcast", function (req, res) {
  const { sender, recipient, amount } = req.body;
  const newTransaction = bitcoin.addTransaction(sender, recipient, amount);
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  // broadcast the transaction to other nodes
  const requestPromises = [];
  bitcoin.networkNodes.forEach((node) => {
    const requestOptions = {
      uri: `${node}/transaction`,
      method: "POST",
      body: newTransaction,
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(() => res.json({ message: "Transaction created and broadcasted" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

//========================= Mining =========================

app.get("/mine", function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock.index + 1,
  };
  const nonce = bitcoin.proofOfWork(
    previousBlockHash,
    currentBlockData,
    bitcoin.difficulty
  );

  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  const newBlock = bitcoin.addBlock(nonce, previousBlockHash, blockHash);
  // broadcast the new block to other nodes
  const requestPromises = [];
  bitcoin.networkNodes.forEach((node) => {
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
      // Broadcast miner reward transaction to all nodes
      const requestOptions = {
        uri: `${bitcoin.currentNodeUrl}/transaction/broadcast`,
        method: "POST",
        body: {
          sender: "00",
          recipient: nodeAddress,
          amount: bitcoin.minerReward,
        },
        json: true,
      };

      return rp(requestOptions);
    })
    .then(() =>
      res.json({
        message: "New block mined and broadcasted successfully",
        block: newBlock,
      })
    )
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.post("/receive-new-block", function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock.index + 1 === newBlock.index;

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({
      message: "New block received and accepted",
      newBlock,
    });
  } else {
    res.json({
      message: "New block rejected",
      newBlock,
    });
  }
});

/**  ========================= Nodes =========================
 * Step 1) A new node will call the /register-and-broadcast-node endpoint of an existing node.
 * That node will be registered within the current node then "broadcasted" to all other nodes.
 * Step 2) The existing node will initate the broadcast by calling /register-node of all nodes in the network.
 * Step 3) Once broadcast is complete, the exisiting node will call the /register-nodes-bulk endpoint on the new node.
 * This will give the new node an updated list of all nodes in the network.
 */
app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;

  // Step 1)
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
    bitcoin.networkNodes.push(newNodeUrl);

  // Step 2)
  const regNodesPromises = [];
  bitcoin.networkNodes.forEach((networkNodesUrl) => {
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
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
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
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    bitcoin.networkNodes.push(newNodeUrl);
  res.json({
    message: "New node registered successfully",
  });
});

app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodesUrl) => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodesUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodesUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      bitcoin.networkNodes.push(networkNodesUrl);
  });
  res.json({
    message: "Bulk registration successful",
  });
});

//========================= Consensus =========================

// Used to correct the chain if a node has the wrong chain data.
app.get("/consensus", function (req, res) {
  const requestPromises = [];

  // get all network nodes and make a request to each one
  bitcoin.networkNodes.forEach((networkNodesUrl) => {
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
      const currentChainLength = bitcoin.chain.length;
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
        (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
      ) {
        res.json({
          message: "Current chain has not been replaced",
          chain: bitcoin.chain,
        });
      } else {
        bitcoin.chain = newLongestChain;
        bitcoin.pendingTransactions = newPendingTransactions;
        res.json({
          message: "This chain has been replaced",
          chain: bitcoin.chain,
        });
      }
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

//========================= Block Explorer =========================
app.get("/block/:blockHash", (req, res) => {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);
  res.json({ block: correctBlock });
});

app.get("/transaction/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  const transactionData = bitcoin.getTransaction(transactionId);
  res.json({ transaction: transactionData });
});

app.get("/address/:address", (req, res) => {
  const address = req.params.address;
  const addressData = bitcoin.getAddressData(address);
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
