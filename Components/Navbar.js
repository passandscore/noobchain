import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-light bg-light  vw-100  ">
        <div className="container-fluid d-flex justify-content-center ">
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
      </nav>
    </>
  );
};

export default Navbar;
