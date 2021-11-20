const logger = require("js-logging").colorConsole();
const axios = require("axios");

const miner = async () => {
  const nodeUrl = `http://localhost:9000`;
  const miningJobUrl = `${nodeUrl}/mine-next-block`;
  while (this.pendingTransactions.length > 0) {
    try {
      let nextBlock = (await axios.get(miningJobUrl)).data;
      logger.debug("Taken mining job: " + JSON.stringify(nextBlock));
      await this.mine(nextBlock);
      logger.info("Mined a block: " + nextBlock.blockHash);
      await this.submitMinedJob(nextBlock);
    } catch (error) {
      logger.error(error);
      if (error.response)
        logger.error(
          "Returned response from node: " + JSON.stringify(error.response.data)
        );
    }
  }
};

module.exports = miner;
