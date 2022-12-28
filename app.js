import express from "express";
import router from "./routes/main.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
