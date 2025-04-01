import express from "express";
import dotenv from "dotenv";
import path from "path";
import converterRouter from "./routes/converter";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/converter", converterRouter);

app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
