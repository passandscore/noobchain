import { atom } from "recoil";

export const lockState = atom({
  key: "lockState",
  default: "locked",
});

export const nodeList = atom({
  key: "nodeList",
  default: ["http://localhost:3001"],
});

export const defaultNode = atom({
  key: "defaultNode",
  default: "http://localhost:3001",
});

export const address = atom({
  key: "address",
  default: "",
});

export const miningDetails = atom({
  key: "miningDetails",
  default: {
    difficulty: "5",
    mode: "automatic",
    privKey: "fb71fe8f62a85d4f6e8be3a1de231c2ab2744d8f919885c23142f246e00634eb",
    pubKey: "6fc5735fc9dd87e6d7e01af2799387a9f3000f6ad7b4e8d8a35c4608f36131211",
    address: "eb3d3124e445546996d9628e86be514bf3cb9275",
  },
});

export const faucetDetails = atom({
  key: "faucetDetails",
  default: {
    privKey: "c30331146ab8cd77fad2662019a8bc9029fe8610efdedb4aaee8f85ad4feb356",
    pubKey: "44997ff666ac720d52067e8bd244bd60873b8fb35eb9cfcda99faf60e4c4deea0",
    address: "b554c373f2544e21f54e6a038c472a3f1de79930",
    duration: "90000",
  },
});
