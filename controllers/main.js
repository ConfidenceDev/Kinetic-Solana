let keypair = null;

//======================== CREATE ACCOUNT =========================
async function createAccount(Keypair, Commitment, kineticClient) {
  const mnemonic = Keypair.generateMnemonic();
  keypair = Keypair.fromMnemonic(mnemonic);

  console.log("Public Key: " + keypair.publicKey);
  console.log("==============================");
  console.log("Secret Key: " + keypair.secretKey);
  console.log("==============================");

  const accountOptions = {
    owner: keypair,
    commitment: Commitment.Finalized,
  };

  return await kineticClient.createAccount(accountOptions);
}

//======================== CHECK BALANCE =============================
async function checkBalance(kineticClient) {
  const balanceOptions = { account: keypair.publicKey };
  const { balance } = await kineticClient.getBalance(balanceOptions);
  return balance;
}

//======================== CHECK BALANCE =============================
async function transferKin(kineticClient) {
  const transferOptions = {
    amount: "5000",
    destination: `BQJi5K2s4SDDbed1ArpXjb6n7yVUfM34ym9a179MAqVo`,
    owner: keypair,
    commitment: Commitment.Finalized, // Optional, can be Finalized, Confirmed, Processed
    type: TransactionType.P2P, // Optional, can be Unknown, None, Earn, Spend or P2P,
    referenceId: "some id", // Optional, stored off-chain and returned via webhooks
    referenceType: "some reference", // Optional, stored off-chain and returned via webhooks
    senderCreate: false, // Optional, will make a Kin Token Account at that destination if true
  };

  return await kineticClient.makeTransfer(transferOptions);
}

export { createAccount };
