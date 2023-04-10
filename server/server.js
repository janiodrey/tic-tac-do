import express from "express";
import cors from "cors";
import "dotenv/config";
import TodoRouter from './routes/todo.js';
import UserController from './controllers/auth.controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', UserController.signup);

app.use('/todos', TodoRouter);

app.listen(Number(process.env.PORT), () => {
  console.log(`Server is up on: http://localhost:${process.env.PORT}`);
});
