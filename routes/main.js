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

router.get("/", (req, res) => {
  DB.createAccount(Keypair, Commitment, kineticClient);
});

export default router;
