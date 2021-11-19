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

export const miningMode = atom({
  key: "miningMode",
  default: "automatic",
});

export const miningDifficulty = atom({
  key: "miningDifficulty",
  default: "5",
});
