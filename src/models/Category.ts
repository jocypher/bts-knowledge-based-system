import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import { Article } from "./Article"

@Entity("categories")
export class Category{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    categoryName!: string

    @OneToMany(()=>Article, (article)=> article.category)
    articles!: Article[]


}
