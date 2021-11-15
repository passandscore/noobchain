const Blockchain = require("./blockchain");
const bitcoin = new Blockchain();

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1636542303617,
      transactions: [],
      nonce: 0,
      hash: "0",
      previousBlockHash: "0",
    },
    {
      index: 2,
      timestamp: 1636542321487,
      transactions: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0",
    },
    {
      index: 3,
      timestamp: 1636542392422,
      transactions: [
        {
          sender: "00",
          recipient: "0e2cbf10421611ec930335d2436fdb2e",
          amount: 12.5,
          transactionId: "18d68b30421611ec930335d2436fdb2e",
        },
        {
          sender: "UEUUEJJJFF",
          recipient: "LLSDS",
          amount: "1000",
          transactionId: "30204e20421611ec930335d2436fdb2e",
        },
        {
          sender: "UEUUEJJJFF",
          recipient: "LLSDS",
          amount: "10",
          transactionId: "3483f660421611ec930335d2436fdb2e",
        },
        {
          sender: "UEUUEJJJFF",
          recipient: "LLSDS",
          amount: "40",
          transactionId: "3a9e9d70421611ec930335d2436fdb2e",
        },
      ],
      nonce: 103,
      hash: "000065572df3c66ec1580dbb8a067f5f176534ba3392e3d9b1de7d77e82b4cef",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 4,
      timestamp: 1636542436839,
      transactions: [
        {
          sender: "00",
          recipient: "0e2cbf10421611ec930335d2436fdb2e",
          amount: 12.5,
          transactionId: "431b9e80421611ec930335d2436fdb2e",
        },
        {
          sender: "UEUUEJJJFF",
          recipient: "LLSDS",
          amount: "4",
          transactionId: "53aea170421611ec930335d2436fdb2e",
        },
        {
          sender: "UEUUEJJJFF",
          recipient: "LLSDS",
          amount: "50",
          transactionId: "56b3cb20421611ec930335d2436fdb2e",
        },
        {
          sender: "UEUUEJJJFF",
          recipient: "LLSDS",
          amount: "1",
          transactionId: "590d7290421611ec930335d2436fdb2e",
        },
        {
          sender: "UEUUEJJJFF",
          recipient: "LLSDS",
          amount: "70",
          transactionId: "5bc7d7a0421611ec930335d2436fdb2e",
        },
      ],
      nonce: 40044,
      hash: "0000f9b9bb36ef440d002cf327068012124c751152e21722995f0c4879d741cf",
      previousBlockHash:
        "000065572df3c66ec1580dbb8a067f5f176534ba3392e3d9b1de7d77e82b4cef",
    },
    {
      index: 5,
      timestamp: 1636542451716,
      transactions: [
        {
          sender: "00",
          recipient: "0e2cbf10421611ec930335d2436fdb2e",
          amount: 12.5,
          transactionId: "5d94f680421611ec930335d2436fdb2e",
        },
      ],
      nonce: 120754,
      hash: "0000f6274d2f4ae9e12f8e853fe527cffddc089529a9d214af235f884734841b",
      previousBlockHash:
        "0000f9b9bb36ef440d002cf327068012124c751152e21722995f0c4879d741cf",
    },
    {
      index: 6,
      timestamp: 1636542455860,
      transactions: [
        {
          sender: "00",
          recipient: "0e2cbf10421611ec930335d2436fdb2e",
          amount: 12.5,
          transactionId: "66732a60421611ec930335d2436fdb2e",
        },
      ],
      nonce: 164522,
      hash: "0000c59a96fa27ca1989df82ec1c80f07fd9ba910a4ea42293aa9d3131d1d589",
      previousBlockHash:
        "0000f6274d2f4ae9e12f8e853fe527cffddc089529a9d214af235f884734841b",
    },
  ],
  pendingTransactions: [
    {
      sender: "00",
      recipient: "0e2cbf10421611ec930335d2436fdb2e",
      amount: 12.5,
      transactionId: "68eb7d60421611ec930335d2436fdb2e",
    },
  ],
  difficulty: "0000",
  minerReward: 12.5,
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [],
};

console.log("VALID", bitcoin.chainIsValid(bc1.chain));
