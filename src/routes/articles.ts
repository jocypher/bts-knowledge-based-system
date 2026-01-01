import express from "express"
import ArticleController from "../controller/ArticleController"

const routes = express.Router()


console.log("Articles router loaded") 


// adding a new article
routes.post("/add", ArticleController.createArticle)



// returning all articles created
routes.get("/", ArticleController.getAllArticles)



// return a specific article
routes.get("/:id", ArticleController.getArticleById)


// delete a specific article
routes.delete("/:id", ArticleController.deleteArticleById)


// get recently added articles 
routes.get("/recent", ArticleController.recentlyAddedArticles)

routes.get("/filter",ArticleController.filterArticles )

// // returning articles by id
// routes.get("/:id", (req:any, res:any)=>{
//     const id = Number(req.params.id)
//     // check if the req has a parameter
//     if(!id)return res.status(400).json({message:"Invalid article id"})

//     // sql query to get an individual article and update views
//     db.prepare(`UPDATE articles SET views = views + 1 WHERE id = ?`).run(id)

//     const getArticle = db.prepare(`SELECT a.title, a.content, c.category_name, a.verification, u.author_name, a.created_at, a.views FROM articles a JOIN users u ON a.author_id = u.id JOIN categories c ON a.category_id = c.id WHERE a.id = ?`).get(id)
//     // article not found
//     if(!getArticle) return res.status(404).json({message:`Article with id: ${id} does not exist`})
    

//     return res.status(200).send(getArticle)
    

// })

// // deleting articles by id and author name due to no authentication this is to prevent 
// // any user from deleting without permission
// routes.delete("/:id/:author_name", (req:any, res:any)=>{
//     const id = Number(req.params.id)
//     const author_name = req.params.author_name

//     if(!id) return res.status(400).json({message: `Invalid article id:${id}` })
//     if(!author_name) return res.status(404).json({message:`Name of author is required`})
//     try{
//         const article = db.prepare(`SELECT a.id FROM articles a JOIN users u ON a.author_id = u.id WHERE a.id = ? AND u.author_name = ? `).get(id, author_name)
//         if(!article) return res.status(404).json({message:"article not found"})
//         db.prepare(`DELETE FROM articles WHERE id = ?`).run(article.id)
        
//         return res.status(200).send("article deleted successfully")
//     }catch(err){
//         return res.status(500).send(err)
//     }
// })


// // updating the articles by the id
// routes.put("/:id", (req:any, res:any)=>{
//     const id = Number(req.params.id)
//     const {title, category_name, content, author_name, updated_at, verification} = req.body


//     if(!id) return res.status(400).send("Invalid article id")
//     // get all ids in the article fields
//      const article = db
//     .prepare(`SELECT id, category_id, author_id FROM articles WHERE id = ?`)
//     .get(id)

//     // check if the article exists
//   if (!article) {
//     return res.status(404).json({ message: "Article not found" })
//   }

//   // check if the user made any updates
//   if (
//     title === undefined &&
//     content === undefined &&
//     verification === undefined &&
//     category_name === undefined &&
//     author_name === undefined
//   ) {
//     return res.status(400).json({ message: "No fields to update" })
//   }
    
//     const transaction = db.transaction(()=>{
//     const updates: string[] = []
//     const values: any[] = []

//     if(title !== undefined){
//         updates.push("title = ?")
//         values.push(title)
//     }

//     if(content !== undefined){
//         updates.push("content = ?")
//         values.push(content)
//     }
 
//     if(verification !== undefined){
//         updates.push("verification=?")
//         values.push(verification)
//     }

//     if (updates.length > 0) {
//       values.push(id)
//       db.prepare(`
//         UPDATE articles
//         SET ${updates.join(", ")},
//             updated_at = CURRENT_TIMESTAMP
//         WHERE id = ?
//       `).run(...values)
//     }


//     // Update category
//     if (category_name !== undefined) {
//       db.prepare(`
//         UPDATE categories
//         SET category_name = ?
//         WHERE id = ?
//       `).run(category_name, article.category_id)
//     }

//     //Update author
//     if (author_name !== undefined) {
//       db.prepare(`
//         UPDATE users
//         SET author_name = ?
//         WHERE id = ?
//       `).run(author_name, article.author_id)
//     }


//     }) 

//    try {
//     transaction()

//     res.status(200).send("Article updated successfully")
//    }catch(err){
//         return res.status(500).send(err)
//    }

// })


export default routes