import { config } from "dotenv";
import express from "express";
import { KineticSdk } from "@kin-kinetic/sdk";
import { Commitment, TransactionType } from "@kin-kinetic/solana";
import { Keypair } from "@kin-kinetic/keypair";
import * as DB from "../controllers/main.js";

config();
const router = express.Router();

const clientOptions = {
  environment: process.env.environment, // mainnet or devnet
  index: parseInt(process.env.index),
  endpoint: process.env.endpoint, // devnet endpoint
};
const kineticClient = await KineticSdk.setup(clientOptions);
const mnemonic = process.env.mnemonic;
const wallet = process.env.wallet;
const wallet2 = "DKXv9A5GgcNRXctCsuJAPDVjaMdxofQByvz3k67p4ifG";

//======================== END POINTS ===============================
router.get("/create", (req, res) => {
  DB.createAccount(Keypair, Commitment, kineticClient, res);
});

router.post("/user-balance", (req, res) => {
  const toWallet = req.body.wallet;
  if (toWallet) {
    DB.checkBalance(kineticClient, toWallet, res);
  }
});

// To recievce alerts when hotwallet is running low on Sol.
router.post("/balance", async (req, res) => {
  const data = req.body;
  if (data) {
    console.log(`KIN BALANCE: ${data}`);
    res.sendStatus(200);
  }
});

router.post("/earn", (req, res) => {
  const toWallet = req.body.wallet;
  if (toWallet && mnemonic) {
    const amount = "50";

    DB.transferKin(
      kineticClient,
      Commitment,
      Keypair,
      mnemonic,
      TransactionType.Earn,
      amount,
      toWallet,
      res
    );
  } else {
    res
      .status(400)
      .json({ status: "failed", msg: "User's wwallet address required!" });
  }
});

router.use("/spend", async (req, res) => {
  const mnemonic = req.body.mnemonic;
  const amount = req.body.amount;

  if (mnemonic && amount) {
    DB.transferKin(
      kineticClient,
      Commitment,
      Keypair,
      mnemonic,
      TransactionType.Spend,
      amount,
      wallet,
      res
    );
  } else {
    res.status(400).json({
      status: "failed",
      msg: "Mnemonic/pass-phrase and amount are required!",
    });
  }
});

router.use("/p2p", async (req, res) => {
  const toWallet = req.body.wallet;
  const mnemonic = req.body.mnemonic;
  const amount = req.body.amount;

  if (toWallet && mnemonic && amount) {
    DB.transferKin(
      kineticClient,
      Commitment,
      Keypair,
      mnemonic,
      TransactionType.P2P,
      amount,
      toWallet,
      res
    );
  } else {
    res.status(400).json({
      status: "failed",
      msg: "Receiver's wallet address, current user's mnemonic/pass-phrase and amount are required!",
    });
  }
});

//============================== WEBHOOKs =====================================
//To receive alerts when actions have been confirmed on the Solana blockchain.
router.use("/spend-hook", async (req, res) => {
  const event = req.body;
  if (event) {
    console.log(event);

    //return res.status(200).json({ status: "success", msg: event });
  }
});

//To check each transactions if they meet our requirements
router.use("/p2p-hook", async (req, res) => {
  const transaction = req.body;
  // CHECK THAT YOU WANT THIS TRANSACTION TO PROCEED
  // e.g.
  if (transaction) {
    console.log(transaction);

    if (transaction.amount < 1000000) {
    }
    //return res.status(200).json({ status: "success", msg: event });
  }
});

export default router;
