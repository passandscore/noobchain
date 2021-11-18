import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <>
      <div className="container">
        <div className="row py-2">
          <div className="col-sm-3 d-inline-flex align-items-center">
            <div className="d-inline-flex align-items-center">
              <Image
                src="/images/block.png"
                width="30"
                height="30"
                className="d-inline-block align-center"
                alt=""
              ></Image>
              <Link href="/">
                <a className="nav-link fs-5">Noobchain</a>
              </Link>
            </div>
          </div>
          <div className="col-sm-9 d-flex flex-row-reverse">
            <div className=" d-inline-flex  ">
              <Link href="/explorer">
                <a className="nav-link fs-5">Explorer</a>
              </Link>
              <Link href="/faucet">
                <a className="nav-link fs-5">Faucet</a>
              </Link>
              <Link href="/wallet">
                <a
                  className="nav-link fs-5"
                  // target="_blank"
                  // rel="noopener noreferrer"
                >
                  Wallet
                </a>
              </Link>
              <Link href="/miner">
                <a className="nav-link fs-5">Miner</a>
              </Link>
              <Link href="/nodes">
                <a className="nav-link fs-5">Nodes</a>
              </Link>
              <Link href="http://localhost:3001/blockchain">
                <a
                  className="nav-link fs-5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blockchain
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
