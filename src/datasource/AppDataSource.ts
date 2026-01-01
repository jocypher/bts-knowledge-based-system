import "reflect-metadata"
import { DataSource } from "typeorm"
import { Article } from "../models/Article"
import { User } from "../models/User"
import { Category } from "../models/Category"


const AppDataSource = new DataSource(
    {
        type: "postgres",
        url: process.env.DATABASE_URL, 
        synchronize: process.env.NODE_ENV !== "production",
        logging: false,
        entities: [Article, User, Category],
        ssl:{
            rejectUnauthorized:false
        }
    }
)



export default AppDataSource