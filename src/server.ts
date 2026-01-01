import express from "express";
import articles from "./routes/articles";
import logger from "./middlewares/loggers/reqLog";
import errorLogs from "./middlewares/loggers/errorLogs";
import AppDataSource from "./datasource/AppDataSource";
import cors from "cors";



const app = express()


const PORT = process.env.PORT || 4000
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(logger)


AppDataSource.initialize().then(()=>{
  console.log("Data source has been initialized")

  app.use("/article", articles)
  

  app.use(errorLogs)

  app.listen(PORT, () => {
  console.log("Server running on 4000")
})
}).catch((err)=>{
  console.log(`${err}`)
})
