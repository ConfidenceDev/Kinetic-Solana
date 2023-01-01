import express from "express";
import router from "./routes/main.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.get("/", (req, res) => {
  res.send("Welcome to Kin Solana Project by ProDev Team!");
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
