const { Connection, PublicKey } = require("@_koi/web3.js");

const stakingKeyConvertor = async (stakingKeys) => {
  const connection = new Connection("https://testnet.koii.live");
  const results = [];

  console.log("checkpoint b");

  for (let stakingKey of stakingKeys) {
    try {
      const publicKey = new PublicKey(stakingKey);
      // Fetching account info with context
      const response = await connection.getConfirmedSignaturesForAddress2(
        publicKey,
        {
          commitment: "confirmed",
        }
      );

      if (response && response.length > 0) {
        // Use the first transaction ID to get details
        const feePayerPublicKey = await getConfirmedTransaction(
          response[0]["signature"],
          connection
        );
        results.push(feePayerPublicKey);
      } else {
        results.push(null); // or push some default value or handle it some other way
      }
    } catch (error) {
      console.error(error);
      results.push(null); // or push some default value or handle it some other way
    }
  }

  return results;
};

const getConfirmedTransaction = async (signature, connection) => {
  try {
    const transaction = await connection.getConfirmedTransaction(
      signature,
      "confirmed"
    );
    const publicKey = new PublicKey(transaction.transaction.feePayer);
    console.log(publicKey.toBase58());
    return publicKey.toBase58();
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  stakingKeyConvertor,
};
