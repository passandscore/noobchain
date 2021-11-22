import styles from "../../styles/BlockExplorer.module.css";

const SearchBar = ({ handleSearch }) => {
  return (
    <div className={styles.landingText}>
      <label htmlFor="basic-url" className="text-white py-2 fs-5">
        Noobchain PoW Testnet Explorer
      </label>
      <div className="input-group mb-3" style={{ height: "25px" }}>
        <div className="input-group-prepend"></div>
        <input
          type="text"
          className="form-control form-control-lg"
          style={{
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
          id="basic-url"
          placeholder="Search by Address / Txn Hash / Block Hash"
        />
        <span
          className="input-group-text bg-info px-4"
          id="basic-addon3"
          style={{
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
            cursor: "pointer",
          }}
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            color="#ffffff"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
            cursor="pointer"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
