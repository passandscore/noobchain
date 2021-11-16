import Head from "next/head";
import Image from "next/image";
import MenuBar from "../../Components/Wallet/MenuBar";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Toast } from "react-bootstrap";

export default function SendTransaction() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Head>
        <title>NOOB Wallet | Send Transaction</title>
      </Head>

      <MenuBar />
      <div className="container ">
        <h1 className="display-5 mt-5">Send Transaction</h1>
        <div>
          <Button variant="primary" className="mt-5" onClick={handleShow}>
            Create New Transaction
          </Button>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Transaction Requirements</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-break">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon3">
                  Recipient
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  style={{ paddingLeft: "25px", paddingRight: "25px" }}
                  id="basic-addon3"
                >
                  Value
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  style={{ paddingLeft: "31px", paddingRight: "31px" }}
                  id="basic-addon3"
                >
                  Fee
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="input-group">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  style={{
                    paddingLeft: "27px",
                    paddingRight: "27px",
                    paddingBottom: "20px",
                    paddingTop: "20px",
                  }}
                >
                  Data
                </span>
              </div>
              <textarea
                className="form-control"
                aria-label="With textarea"
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="btn btn-outline-primary" onClick={handleClose}>
              Sign Transaction
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Send Transaction
            </Button>
          </Modal.Footer>
        </Modal>

        <button
          type="button"
          id="buttonSignTransaction"
          className="btn btn-outline-secondary my-2 w-100"
          disabled
        >
          Signature Details
        </button>

        <form>
          <div className="form-group mb-5">
            <textarea className="form-control" rows="6"></textarea>
          </div>

          <button
            type="button"
            id="buttonSendSignedTransaction"
            className="btn btn-outline-secondary my-2 w-100"
            disabled
          >
            Transaction Details
          </button>

          <div className="form-group">
            <textarea className="form-control" rows="6"></textarea>
          </div>
        </form>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          zIndex: "4",
        }}
      >
        <Toast className="ml-10">
          <Toast.Header>
            <Image
              src="/images/block.png"
              width="16px"
              height="16px"
              className="rounded"
              alt=""
            />
            <strong className="me-auto">Address:</strong>
            0xjoidsfh87sdfod8sfsdufsfdsd
          </Toast.Header>
          <Toast.Body>Node URL: http//localhost:3001</Toast.Body>
        </Toast>
      </div>
    </>
  );
}
