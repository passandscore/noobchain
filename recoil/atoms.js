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
