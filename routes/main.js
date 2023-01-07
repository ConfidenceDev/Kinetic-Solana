import express from "express";
import { KineticSdk } from "@kin-kinetic/sdk";
import { Commitment, TransactionType } from "@kin-kinetic/solana";
import { Keypair } from "@kin-kinetic/keypair";
import * as DB from "../controllers/main.js";

const router = express.Router();

const clientOptions = {
  environment: "devnet", // mainnet or devnet
  index: 1, // your App Index
  endpoint: "https://sandbox.kinetic.host", // devnet endpoint
};
const kineticClient = await KineticSdk.setup(clientOptions);
const mnemonic =
  "tobacco dumb bracket spawn april ethics evoke cigar bargain slice south copper";
const wallet = "Hng77LRbVKKVrVPYGoqy73L3hZN63pBxTMq4yZtF6MNW";
const wallet2 = "DKXv9A5GgcNRXctCsuJAPDVjaMdxofQByvz3k67p4ifG";

//======================== END POINTS ===============================
router.get("/create", (req, res) => {
  DB.createAccount(Keypair, Commitment, kineticClient, res);
});

router.post("/balance", (req, res) => {
  //const wallet = req.body.wallet;
  if (wallet) {
    DB.checkBalance(kineticClient, wallet2, res);
  }
});

router.post("/earn", (req, res) => {
  //const toWallet = req.body.wallet;
  //const mnemonic = req.body.mnemonic;
  const toWallet = wallet2;
  if (toWallet && mnemonic) {
    const amount = "100";

    DB.transferKin(
      kineticClient,
      Commitment,
      TransactionType,
      Keypair,
      mnemonic,
      amount,
      toWallet,
      res
    );
  }
});

//======================== WEBHOOKs ===============================
// To recievce alerts when hotwallet is running low on Sol.
router.use("/balance", async (req, res) => {
  const data = req.body;
  // DO STUFF WITH THE BALANCE ALERT
  res.sendStatus(200);
});

//To receive alerts when actions have been confirmed on the Solana blockchain.
router.use("/events", async (req, res) => {
  const event = req.body;
  // DO STUFF WITH THE EVENT DATA
  res.sendStatus(200);
});

//To check each transactions if they meet our requirements
router.use("/verify", async (req, res) => {
  const transaction = req.body;
  // CHECK THAT YOU WANT THIS TRANSACTION TO PROCEED
  // e.g.
  if (transaction.amount < 1000000) {
    res.sendStatus(200);
  }
  res.sendStatus(400);
});

export default router;
