import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import groupRouter from "./routes/groupRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import balanceRouter from "./routes/balanceRoute.js";

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users",userRouter);
app.use("/api/groups",groupRouter);
app.use("/api/expenses",expenseRouter);
app.use("/api/balances",balanceRouter);


app.get("/", (req, res) => {
  res.send("Expense Splitter Backend is running");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;