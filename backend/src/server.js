import express from "express"
import dotenv from "dotenv"
import queryRoute from "./routes/queryRoute.js"
import cors from "cors"

dotenv.config(); // For accessing .env variable in backend

const app = express();
app.use(express.json()) // for parsing json in backend

app.use(cors({
  origin:process.env.FRONTEND_URI
}))
const PORT = process.env.PORT || 8080

app.use("/", queryRoute )

app.listen(PORT, ()=>{
  console.log("Server is running on PORT: ", PORT);
  
})