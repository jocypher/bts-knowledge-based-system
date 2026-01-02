import { DateUtils } from "typeorm/util/DateUtils.js"
import AppDataSource from "../datasource/AppDataSource"
import { Article } from "../models/Article"
import { Category } from "../models/Category"
import { User } from "../models/User"





// now that the db has been initialized.
// we need to get the routes setup for each of the operations
// // create - new article with details
// //  update - update the current articles
// // delete the existing articles
// // get all the articles 
// // get articles by id 
// filter articles by categories details
// optimize search for categories 


const createArticle = async(req:any, res:any, next:any)=>{
    const { title , category_name, content, author_name, verification} = req.body

    if(!title || !category_name || !content || !author_name || !verification) return res.status(400).send("All fields are required")

    try{
         console.log("Getting repositories...") 
       // call all repos
        const userRepo = AppDataSource.getRepository(User)
        const categoryRepo = AppDataSource.getRepository(Category)
        const articleRepo = AppDataSource.getRepository(Article)
         console.log("Repositories obtained successfully") 


        //USER
         // insert the user if he does not exist
         let user = await userRepo.findOne({
            where:{
                authorName: author_name
            }
         })
         if(!user) {
            user =  userRepo.create({authorName: author_name})
            await userRepo.save(user)
         }

         // CATEGORY
        // insert the category if it does not exist
        let category = await categoryRepo.findOne({
            where:{
                categoryName: category_name
            }
        })
        if(!category) {
            
        category = categoryRepo.create({categoryName: category_name})
        await categoryRepo.save(category)
    }


        // insert the article
        let article =  articleRepo.create({
            title,
            content,
            verification,
            author: user,
            category
        })
        const saved = await articleRepo.save(article)
        return res.status(201).json(saved)

    }catch(err:any){
        console.error("Create article error:", err)
  return res.status(500).json({
    message: "Failed to create article",
    error: err.message ?? err
  })
    }
}


//get all articles 
const getAllArticles = async(req:any, res:any)=>{
    const articleRepo = AppDataSource.getRepository(Article)
    let articles = await articleRepo.find({relations: ["author", "category"]})
    return res.status(200).json(articles)
}

// get article by id

const getArticleById = async(req:any, res:any)=>{
    const articleRepo = AppDataSource.getRepository(Article)
    const id = Number(req.params.id)


    if(!id) return res.status(400).json({message:"Article id not found"})
    
    const article = await articleRepo.findOne({
        where:{
            id: id,
        },
        relations: ['author', 'category']
    })

    if (!article) return res.status(404).json({ message: "Article not found" });

    article.views = (article.views??0) + 1
    await articleRepo.save(article)
    return res.status(200).json(article)
}



// delete Article by id
const deleteArticleById = async(req:any, res:any)=>{
    const articleRepo = AppDataSource.getRepository(Article)
    const id = Number(req.params.id)

    await articleRepo.delete({
        id: id
    })
    return res.status(200).send("Article deleted successful")
}


// update Articles
const updateAddedArticle = async(req:any, res:any)=>{
    const id = Number(req.params.id)
    const {title , category_name, content, author_name, verification} = req.body;

    if(isNaN(id)) return res.status(400).json({message: "Invalid article id"})
    
    const articleRepo = AppDataSource.getRepository(Article)
    const userRepo = AppDataSource.getRepository(User)
    const categoryRepo = AppDataSource.getRepository(Category)

    try{

    const article = await articleRepo.findOne({
        where:{
            id: id
        },
        relations: ["author", "category"]
    })
    
    if(!title && !content && !category_name && !author_name && !verification) return res.status(400).json({message: "No fields required to update"})
    
    if(title) article!.title = title
    if(content) article!.content = content
    if(verification) article!.verification = verification
    article!.updatedAt = new Date()

    if(author_name) {
        let user = await userRepo.findOne({
            where:{
                authorName: author_name
            }
        })
    if(!user){
         user = await userRepo.create({
            authorName: author_name  
        })
        await userRepo.save(user)
    }
    article!.author = user  
    }

    if(category_name){
        let category = await categoryRepo.findOne({
            where:{
                categoryName:category_name
            }
        })
    if(!category){
        category = await categoryRepo.create({
            categoryName:category_name
        })
        await categoryRepo.save(category)
    }
        article!.category = category
    }


//Save the updated article
     await articleRepo.save(article!)

    // Fetch the complete article with relations
    const completeArticle = await articleRepo.findOne({
      where: { id },
      relations: ["author", "category"]
    })

    return res.status(200).send(completeArticle)
}catch(err:any ){
    console.error("Update article error:", err)
    return res.status(500).json({
      message: "Failed to update article",
      error: err.message
    })
}
    
}

// most recentlyAddedArticles
const recentlyAddedArticles = async(req:any, res:any)=>{
    const articleRepo = AppDataSource.getRepository(Article)
    const recentlyAddedArticles = 
    await articleRepo
    .createQueryBuilder('article')
    .leftJoinAndSelect('article.author', 'author')
    .leftJoinAndSelect('article.category', 'category')
    .addOrderBy('article.createdAt',"DESC").limit(2).getMany()
    if(!recentlyAddedArticles) return res.status(400).json({message: "No recently added articles"})
    return res.status(200).json(recentlyAddedArticles)
}

// filter articles
const filterArticles = async(req:any, res:any)=>{
    const filter = req.query.q;
    const articleRepo = AppDataSource.getRepository(Article)

    if(!filter) return res.status(400).json({message: "Query parameter q is required"})

    const filteredArticles = await articleRepo
    .createQueryBuilder('article')
    .leftJoinAndSelect('article.author', 'author')
    .leftJoinAndSelect('article.category', 'category')

    .where('article.title LIKE :filter', {filter: `%${filter}%`})
    .orWhere('author.authorName LIKE :filter')
    .orWhere('category.categoryName LIKE :filter')
    .orWhere('article.content LIKE :filter ')
    .orWhere('article.verification LIKE :filter')
    .getMany()

    return res.status(200).json(filteredArticles)
}





export default {createArticle,getAllArticles, getArticleById, deleteArticleById, recentlyAddedArticles, filterArticles,updateAddedArticle}
