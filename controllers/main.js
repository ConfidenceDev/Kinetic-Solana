import { uuid } from "uuidv4";

//======================== CREATE ACCOUNT =========================
async function createAccount(Keypair, Commitment, kineticClient, res) {
  try {
    const mnemonic = Keypair.generateMnemonic();
    const keypair = Keypair.fromMnemonic(mnemonic);

    const accountOptions = {
      owner: keypair,
      commitment: Commitment.Finalized,
    };

    const result = await kineticClient.createAccount(accountOptions);
    if (result) {
      const doc = {
        id: result.id,
        createdAt: result.createdAt,
        publicKey: keypair.publicKey,
        secretKey: keypair.secretKey,
        mnemonic: mnemonic,
      };
      return res.status(201).json({ status: "success", msg: doc });
    }

    return res
      .status(401)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

//======================== CHECK BALANCE =============================
async function checkBalance(kineticClient, wallet, res) {
  try {
    const balanceOptions = { account: wallet };
    const { balance } = await kineticClient.getBalance(balanceOptions);
    if (balance) {
      return res.status(200).json({ status: "success", msg: balance });
    }

    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

//======================== TRANSFER =============================
async function transferKin(
  kineticClient,
  Commitment,
  Keypair,
  mnemonic,
  type,
  amt,
  dest,
  res
) {
  try {
    const keypair = await Keypair.fromMnemonic(mnemonic);
    const transferOptions = {
      amount: amt,
      destination: dest,
      owner: keypair,
      commitment: Commitment.Finalized, // Optional, can be Finalized, Confirmed, Processed
      type: type, // Optional, can be Unknown, None, Earn, Spend or P2P,
      referenceId: uuid(), // Optional, stored off-chain and returned via webhooks
      referenceType: "single", // Optional, stored off-chain and returned via webhooks
      senderCreate: false, // Optional, will make a Kin Token Account at that destination if true
    };

    const result = await kineticClient.makeTransfer(transferOptions);
    if (result) {
      const doc = {
        id: result.id,
        createdAt: result.createdAt,
        amount: result.amount,
        decimals: result.decimals,
        referenceId: result.referenceId,
        referenceType: result.referenceType,
        toWallet: dest,
      };
      return res.status(200).json({ status: "success", msg: doc });
    }

    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

//======================== TRANSFER BATCH =============================
async function transferBatch(
  kineticClient,
  Commitment,
  Keypair,
  type,
  mnemonic,
  dests,
  res
) {
  try {
    /*const destinations = [
    {
      amount: "500",
      destination: `BQJi5K2s4SDDbed1ArpXjb6n7yVUfM34ym9a179MAqVo`,
    },
  ];*/
    const keypair = await Keypair.fromMnemonic(mnemonic);
    const transferBatchOptions = {
      owner: keypair,
      destinations: dests,
      commitment: Commitment.Finalized,
      type: type,
      referenceId: uuid(), // Optional, stored off-chain and returned via webhooks
      referenceType: "batch", // Optional, stored off-chain and returned via webhooks
      senderCreate: false, // Optional, will make a Kin Token Account at that destination if true
    };

    const result = await kineticClient.makeTransferBatch(transferBatchOptions);
    if (result) {
      return res.status(200).json({ status: "success", msg: result });
    }

    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

//======================== GET TRANSACTION DETAILS ===================
async function getTransactionDetails(kineticClient, transactionId, res) {
  try {
    const result = await kineticClient.getTransaction({ transactionId });
    if (result) {
      return res.status(200).json({ status: "success", msg: result });
    }

    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

//======================== GET ACCOUNT HISTORY ===================
async function getAccountHistory(kineticClient, Keypair, mnemonic, res) {
  try {
    const keypair = await Keypair.fromMnemonic(mnemonic);
    const historyOptions = { account: keypair.publicKey };
    const result = await kineticClient.getHistory(historyOptions);
    if (result) {
      return res.status(200).json({ status: "success", msg: result });
    }

    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

//======================== GET ACCOUNT INFO ======================
async function getAccountInfo(kineticClient, Keypair, mnemonic, res) {
  try {
    const keypair = await Keypair.fromMnemonic(mnemonic);
    const getAccountInfoOptions = { account: keypair.publicKey };
    const result = await kineticClient.getAccountInfo(getAccountInfoOptions);
    if (result) {
      return res.status(200).json({ status: "success", msg: result });
    }

    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

//======================== CLOSE ACCOUNT =============================
async function closeAccount(Commitment, kineticClient, Keypair, mnemonic, res) {
  try {
    const keypair = await Keypair.fromMnemonic(mnemonic);
    const closeAccountOptions = {
      account: keypair.publicKey,
      commitment: Commitment.Finalized, // Optional, can be Finalized, Confirmed, Processed
    };
    const result = await kineticClient.closeAccount(closeAccountOptions);
    if (result) {
      return res
        .status(200)
        .json({ status: "success", msg: "account terminated!" });
    }

    return res
      .status(400)
      .json({ status: "failed", msg: "something went wrong!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", msg: "something went wrong!" });
  }
}

export { createAccount, checkBalance, transferKin };
