import { atom } from "recoil";

export const lockState = atom({
  key: "lockState",
  default: "locked",
});
