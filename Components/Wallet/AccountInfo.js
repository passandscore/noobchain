import { Toast } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { defaultNode, address } from "../../recoil/atoms";

const AccountInfo = () => {
  // const [address, setAddress] = useState("");
  const node = useRecoilValue(defaultNode);
  const walletAddress = useRecoilValue(address);

  // useEffect(() => {
  //   setAddress(sessionStorage.getItem("address"));
  // }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        zIndex: "4",
      }}
    >
      <Toast className="ml-10 bg-light border-info" style={{ width: "26rem" }}>
        <Toast.Header closeButton={false}>
          <Image
            src="/images/block.png"
            width="16px"
            height="16px"
            className="rounded"
            alt=""
          />
          <strong className="me-auto mx-1">Address:</strong>
          {walletAddress ? (
            <Link href="/explorer">{walletAddress}</Link>
          ) : (
            <Link href="/wallet">Connect to wallet</Link>
          )}
        </Toast.Header>
        <Toast.Body className="text-center">
          <strong>You are currently connected to {node} </strong>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default AccountInfo;
