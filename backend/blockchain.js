const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];
const uuid = require("uuid/v1");

/**
 * @notice - Creates a new blockchain
 * @property {array} chain - The blockchain to be created
 * @property {array} pendingTransactions - The pending transactions to be added to the blockchain
 * @property {string} difficulty - The difficulty of the blockchain proof of work algorithm.
 * @function addBlock - Adds a genesis block to the blockchain.
 */
class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.difficulty = "0000";
    this.minerReward = 12.5;

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    this.addBlock(0, "0", "0");
  }

  /**
   * @notice - Adds a new block to the chain
   * @param nonce - The nonce used to mine the block
   * @param previousBlockHash - The hash of the previous block
   * @param hash - The hash of the current block
   * @return - The new block
   */
  addBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * @notice - Creates a transaction object.
   * @param sender - The sender of the transaction
   * @param recipient - The recipient of the transaction
   * @param amount - The amount of the transaction
   * @return - A transaction object
   */
  addTransaction(sender, recipient, amount) {
    const transactionId = uuid().split("-").join("");
    const newTransaction = {
      sender,
      recipient,
      amount,
      transactionId,
    };

    return newTransaction;
  }

  /**
   * @notice - Adds a new transaction to the list of pending transactions
   * @param transactionObj - An object containing the transaction details.
   * @return - The index of the block that will hold this transaction
   */
  addTransactionToPendingTransactions(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()["index"] + 1;
  }

  /**
   * @notice - Returns the hash of the block
   * @param previousBlockHash - The hash of the previous block
   * @param currentBlockData - The data of the current block
   * @param nonce - The nonce used to mine the block
   * @return - The hash of the block
   */
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  /**
   * @notice - Performs proof of work using the given difficulty
   * @param previousBlockHash - The hash of the previous block
   * @param currentBlockData - The data of the current block
   * @param difficulty - The difficulty of the blockhash
   * @return - A nonce that solves the proof of work
   */
  proofOfWork(previousBlockHash, currentBlockData, difficulty) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== difficulty) {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
  }

  /**
   * @notice - Checks if the given blockchain is valid by checking the hashes of each block
   * @param blockchain - The blockchain to be checked
   * @return - True if the blockchain is valid, false otherwise
   */
  chainIsValid(blockchain) {
    let validChain = true;

    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const previousBlock = blockchain[i - 1];

      // Check if the hash (data) of the current block is correct
      const blockHash = this.hashBlock(
        previousBlock["hash"],
        {
          transactions: currentBlock["transactions"],
          index: currentBlock["index"],
        },
        currentBlock["nonce"]
      );
      if (blockHash.substring(0, 4) !== this.difficulty) {
        validChain = false;
      }

      // Check if the previous block hash is correct
      if (currentBlock["previousBlockHash"] !== previousBlock["hash"]) {
        validChain = false;
      }
    }

    // Check if the genesis block is valid
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock["nonce"] === 0;
    const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
    const correctHash = genesisBlock["hash"] === "0";
    const correctTransactions = genesisBlock["transactions"].length === 0;
    if (
      !correctNonce ||
      !correctPreviousBlockHash ||
      !correctHash ||
      !correctTransactions
    ) {
      validChain = false;
    }

    return validChain;
  }

  /**
   * @notice - Returns the block with the given hash
   * @param blockHash - The hash of the block to be returned
   * @return - The block with the given hash
   */
  getBlock(blockHash) {
    let correctBlock = null;
    this.chain.forEach((block) => {
      if (block.hash === blockHash) {
        correctBlock = block;
      }
    });
    return correctBlock;
  }

  /**
   * @notice - Searches the blockchain for a transaction with the given transactionId
   * @param transactionId - The transactionId of the transaction to be returned
   * @return - The transaction with the given transactionId along with the block it was found in
   */
  getTransaction(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;
    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        }
      });
    });
    if (!correctTransaction) {
      return null;
    } else {
      return { transaction: correctTransaction, block: correctBlock };
    }
  }

  /**
   * @notice - Searches the blockchain for the provided address within a all transactions
   * @param address - The address whose balance is to be returned
   * @return - The balance of the given address
   */
  getAddressData(address) {
    const addressTransactions = [];

    // Get all transactions from the blockchain
    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        // Add the transaction to the list if it is from the given address
        if (
          transaction.sender === address ||
          transaction.recipient === address
        ) {
          addressTransactions.push(transaction);
        }
      });
    });
    // Calculate the balance of the given address
    let balance = 0;
    addressTransactions.forEach((transaction) => {
      if (transaction.sender === address) {
        balance -= Number(transaction.amount);
      } else if (transaction.recipient === address) {
        balance += Number(transaction.amount);
      }
    });
    return {
      transactions: addressTransactions,
      addressBalance: balance,
    };
  }
}

module.exports = Blockchain;
