import express from "express";
import employeesRouter from "./routes/employees.js";

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  response.send("Hello employees!");
});

app.use("/employees", employeesRouter);

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send("Something went wrong.");
});

export default app;
