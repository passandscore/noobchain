import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.json";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <div
        style={{
          overflow: "hidden",
          display: "block",
          position: "relative",
          paddingBottom: "100px" /* height of your footer */,
        }}
      >
        <Navbar />

        <div>{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
