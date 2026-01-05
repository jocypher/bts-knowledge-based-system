import "reflect-metadata"
import { DataSource } from "typeorm"
import { Article } from "../models/Article"
import { User } from "../models/User"
import { Category } from "../models/Category"

const isProduction = process.env.NODE_ENV === "production";

const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    
    extra: {
        max: 5,
        connectionTimeoutMillis: 10000,
    },
    
    // SSL only for production (Render requires it)
    ssl: isProduction ? {
        rejectUnauthorized: false
    } : false,
    
    logging: !isProduction,
    entities: [Article, User, Category],
})



export default AppDataSource