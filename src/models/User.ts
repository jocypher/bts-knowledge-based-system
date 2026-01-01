import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Article } from "./Article";

@Entity("users")
export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique : true})
    authorName!: string

    @OneToMany(()=> Article, (articles)=> articles.author)
    articles!: Article[]

}
