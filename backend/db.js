//Manages connections and operations with the database 
//https://github.com/mohammad-taheri1/Book-Store-MERN-Stack

import matchRoutes from "./routes/matchRoutes.js";
import { MongoDBURL, PORT } from "./config.js";
import express from "express";
import cors from 'cors';
import mongoose from "mongoose";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/books", matchRoutes);

mongoose
  .connect(MongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });