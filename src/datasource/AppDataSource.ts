import "reflect-metadata"
import { DataSource } from "typeorm"
import { Article } from "../models/Article"
import { User } from "../models/User"
import { Category } from "../models/Category"


const AppDataSource = new DataSource(
    {
        type: "postgres",
        // url: process.env.DATABASE_URL, 
        database:"bts_db",
        username:"postgres",
        host: "localhost",
        password:"asdfghjkl",
        port: 5050,
        synchronize: true,
        logging: false,
        entities: [Article, User, Category],
    }
)



export default AppDataSource