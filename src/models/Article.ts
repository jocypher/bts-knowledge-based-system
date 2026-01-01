import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn} from "typeorm"
import {User} from "./User"
import { Category } from "./Category";
@Entity("articles")
export class Article{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable:false})
    title!: string

    @Column("text", {nullable:false})
    content!: string

    @Column({default: 0})
    views!: number

    @ManyToOne(()=> User, (user)=> user.articles,{nullable: false})
    @JoinColumn({ name: "author_id" })
    author!: User

    @ManyToOne(()=>Category, (category)=>category.articles)
    @JoinColumn({ name: "category_id"})
    category!: Category

    @Column()
    verification!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date







}