//Manages connections and operations with the database 
//https://github.com/mohammad-taheri1/Book-Store-MERN-Stack

import matchRoutes from "./routes/matchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import { PORT } from "./config.js";
import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MongoDBURL })
}))

app.use("/matches", matchRoutes);

app.use("/users", userRoutes);

app.use("/skills", skillRoutes);

mongoose
  .connect(process.env.MongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });