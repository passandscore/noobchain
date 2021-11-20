const Block = require("../block");
const Transaction = require("../Transaction");
const CryptoUtils = require("./CryptoUtils");

const faucetPrivateKey =
  "c30331146ab8cd77fad2662019a8bc9029fe8610efdedb4aaee8f85ad4feb356";
const faucetPublicKey = CryptoUtils.privateKeyToPublicKey(faucetPrivateKey);
const faucetAddress = CryptoUtils.publicKeyToAddress(faucetPublicKey);

const nullAddress = "0000000000000000000000000000000000000000";
const nullPubKey =
  "00000000000000000000000000000000000000000000000000000000000000000";
const nullSignature = [
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
];

const genesisDate = "2021-11-01T00:00:00.000Z";
const genesisFaucetTransaction = new Transaction(
  nullAddress, // from address
  faucetAddress, // to Address
  1000000000000, // value of transfer
  0, // fee for mining
  genesisDate, // dateCreated
  "genesis tx", // data (payload)
  nullPubKey, // senderPubKey
  undefined, // transactionDataHash
  nullSignature, // senderSignature
  0, // minedInBlockIndex
  true // transferSuccessful
);

const genesisBlock = new Block(
  0, // block index
  [genesisFaucetTransaction], // transactions array
  0, // currentDifficulty
  undefined, // previous block hash
  nullAddress, // mined by (address)
  undefined, // block data hash
  0, // nonce
  genesisDate, // date created
  undefined // block hash
);

module.exports = {
  defaultServerHost: "localhost",
  defaultServerPort: 3001,
  faucetPrivateKey,
  faucetPublicKey,
  faucetAddress,
  nullAddress,
  nullPubKey,
  nullSignature,
  startDifficulty: 5,
  minTransactionFee: 10,
  maxTransactionFee: 1000000,
  blockReward: 50000,
  maxTransferValue: 10000000000000,
  safeConfirmCount: 3,
  genesisBlock,
};
