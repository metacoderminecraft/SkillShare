//Manages connections and operations with the database 
//https://github.com/mohammad-taheri1/Book-Store-MERN-Stack

import router from "./routes/userRoutes.js";
import { MongoDBURL, PORT } from "./config.js";

const app = express();

app.use(express.json());

app.use("/books", router);

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