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
                class="d-inline-block align-center"
                alt=""
              ></Image>
              <a className="navbar-brand px-2" href="#">
                Noobchain
              </a>
            </div>
          </div>
          <div className="col-sm-9 d-flex flex-row-reverse">
            <div className=" d-inline-flex  ">
              <Link href="/">
                <a className="nav-link fs-5">Block Explorer</a>
              </Link>
              <Link href="/wallet">
                <a
                  className="nav-link fs-5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </a>
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
