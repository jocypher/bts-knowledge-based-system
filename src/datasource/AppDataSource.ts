import "reflect-metadata"
import { DataSource } from "typeorm"
import { Article } from "../models/Article"
import { User } from "../models/User"
import { Category } from "../models/Category"


const AppDataSource = new DataSource(
    {
        type: "postgres",
        host: "localhost", 
        port: 5050,
        username:"postgres",
        password: "asdfghjkl", 
        synchronize: true,
        logging: false,
        database: "bts_db",
        entities: [Article, User, Category]
    }
)


export default AppDataSource