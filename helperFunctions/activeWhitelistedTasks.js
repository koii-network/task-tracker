const { Connection, PublicKey } = require("@_koi/web3.js");

const TASK_CONTRACT_ID = "Koiitask22222222222222222222222222222222222";
const k2NetworkUrl = "https://testnet.koii.live";
const k2Connection = new Connection(k2NetworkUrl);

const getProgramAccountFilter = {
  memcmp: {
    offset: 0,
    bytes: "3Kmn7njZy6VxH4uiq",
  },
  // String "3Kmn7njZy6VxH4uiq" is base58 encoded version of `{"task_name"` which would exist in every task
};

async function fetchAllTaskIds() {
  const allTaskPubkeys = (
    await k2Connection.getProgramAccounts(new PublicKey(TASK_CONTRACT_ID), {
      dataSlice: {
        offset: 0,
        length: 0,
      },
      filters: [getProgramAccountFilter],
    })
  ).map(({ pubkey }) => pubkey.toBase58());

  return allTaskPubkeys; // Return the list of task pubkeys
}

async function fetchTaskDetails(taskId) {
  const accountInfo = await k2Connection.getAccountInfo(new PublicKey(taskId));
  const accountInfoData = JSON.parse(accountInfo.data + "");
  return accountInfoData;
}

async function filterActiveWhitelistedTasks(taskIds) {
  const activeWhitelistedTasks = [];

  for (let taskId of taskIds) {
    const taskData = await fetchTaskDetails(taskId);

    if (taskData.is_active && taskData.is_whitelisted) {
      activeWhitelistedTasks.push(taskId);
    }
  }

  return activeWhitelistedTasks; // Return array of taskIds
}

async function activeWhitelistedTasks() {
  const taskIds = await fetchAllTaskIds();
  return await filterActiveWhitelistedTasks(taskIds);
}

module.exports = {
  activeWhitelistedTasks,
};
