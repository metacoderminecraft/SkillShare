//Manages connections and operations with the database
import router from "./routes/bookRoutes.js";
import { MongoDBURL } from "./config.js";

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