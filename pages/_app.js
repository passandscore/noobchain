import "../styles/globals.css";
import Layout from "../Components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Layout style={{ minWidth: "700px" }}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
