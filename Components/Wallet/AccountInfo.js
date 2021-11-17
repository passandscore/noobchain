import { Toast } from "react-bootstrap";
import Image from "next/image";
import { useEffect, useState } from "react";

const AccountInfo = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    setAddress(sessionStorage.getItem("address"));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        zIndex: "4",
      }}
    >
      <Toast className="ml-10" style={{ width: "26rem" }}>
        <Toast.Header closeButton={false}>
          <Image
            src="/images/block.png"
            width="16px"
            height="16px"
            className="rounded"
            alt=""
          />
          <strong className="me-auto mx-1">Address:</strong>
          {address}
        </Toast.Header>
        <Toast.Body className="text-center">
          <strong> You are currently connected to http//localhost:3001 </strong>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default AccountInfo;
