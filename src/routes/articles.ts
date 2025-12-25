const express = require("express")

const db = require("../db/db")


const routes = express.Router()

// now that the db has been initialized or created , 
// we need to get the routes setup for each of the operations
// // create - new article with details
// //  update - update the current articles
// // delete the existing articles
// // get all the articles 
// // get articles by id 
// filter articles by categories details
// optimize search for categories 



routes.post("/add",(req:any, res:any) => {
    
    const { title , category_name, content, author_name, verification} = req.body
    
   if(!title || !category_name || !content || !author_name) return res.status(400).json({message: "All fields are required"})
    
    try{
        // insert category for application
    const insertCategory = db.prepare(
        `INSERT INTO categories(category_name) VALUES(?)`
    )

    // insert the author name 
    const insertAuthor = db.prepare(
        `INSERT INTO users(author_name) VALUES(?)`
    )
   
    // insert the article
    const insertArticle = db.prepare(
        `INSERT INTO articles(title, category_id, content, author_id,verification) VALUES(?,?,?,?,?)`
    )

    // a transaction to insert the article;implement an all or nothing case
    const insertArticleTransaction = db.transaction((title: string, category_name:string, content:string, author_name:string, verification:string)=>{
        insertCategory.run(category_name)
        const categoryId = db.prepare(`SELECT id FROM categories WHERE category_name=?`).get(category_name)

        insertAuthor.run(author_name)
        const authorId = db.prepare(`SELECT id FROM users WHERE author_name=?`).get(author_name)

        const res = insertArticle.run(title, categoryId.id,content, authorId.id,verification)
        return res
})
    
       const result =  insertArticleTransaction(title, category_name,content, author_name,verification)

    console.log(result)

    return res.status(200).json({message: result})

    }catch(err){
        return res.status(500).json({message: err})
    }
    

})



// returning all articles created
routes.get("/", (req:any, res:any)=>{
    //sql query to get all the articles available
    const getAllArticles = db.prepare(`SELECT a.title, a.content, c.category_name, a.verification, u.author_name, a.created_at, a.views FROM articles a JOIN users u ON a.author_id = u.id JOIN categories c ON a.category_id = c.id`).all()

    //check if the article is empty
    if(getAllArticles.length == 0) return res.status(404).json({message:"No articles present"})

    return res.status(200).json(getAllArticles)
})

// returning articles by id
routes.get("/:id", (req:any, res:any)=>{
    const id = Number(req.params.id)
    // check if the req has a parameter
    if(!id)return res.status(400).json({message:"Invalid article id"})

    // sql query to get an individual article and update views
    db.prepare(`UPDATE articles SET views = views + 1 WHERE id = ?`).run(id)

    const getArticle = db.prepare(`SELECT a.title, a.content, c.category_name, a.verification, u.author_name, a.created_at, a.views FROM articles a JOIN users u ON a.author_id = u.id JOIN categories c ON a.category_id = c.id WHERE a.id = ?`).get(id)
    // article not found
    if(!getArticle) return res.status(404).json({message:`Article with id: ${id} does not exist`})
    

    return res.status(200).send(getArticle)
    

})

// deleting articles by id and author name due to no authentication this is to prevent 
// any user from deleting without permission
routes.delete("/:id/:author_name", (req:any, res:any)=>{
    const id = Number(req.params.id)
    const author_name = req.params.author_name

    if(!id) return res.status(400).json({message: `Invalid article id:${id}` })
    if(!author_name) return res.status(404).json({message:`Name of author is required`})
    try{
        const article = db.prepare(`SELECT a.id FROM articles a JOIN users u ON a.author_id = u.id WHERE a.id = ? AND u.author_name = ? `).get(id, author_name)
        if(!article) return res.status(404).json({message:"article not found"})
        db.prepare(`DELETE FROM articles WHERE id = ?`).run(article.id)
        
        return res.status(200).send("article deleted successfully")
    }catch(err){
        return res.status(500).send(err)
    }
})


// updating the articles by the id
routes.put("/:id", (req:any, res:any)=>{
    const id = Number(req.params.id)
    const {title, category_name, content, author_name, updated_at, verification} = req.body


    if(!id) return res.status(400).send("Invalid article id")
    // get all ids in the article fields
     const article = db
    .prepare(`SELECT id, category_id, author_id FROM articles WHERE id = ?`)
    .get(id)

    // check if the article exists
  if (!article) {
    return res.status(404).json({ message: "Article not found" })
  }

  // check if the user made any updates
  if (
    title === undefined &&
    content === undefined &&
    verification === undefined &&
    category_name === undefined &&
    author_name === undefined
  ) {
    return res.status(400).json({ message: "No fields to update" })
  }
    
    const transaction = db.transaction(()=>{
    const updates: string[] = []
    const values: any[] = []

    if(title !== undefined){
        updates.push("title = ?")
        values.push(title)
    }

    if(content !== undefined){
        updates.push("content = ?")
        values.push(content)
    }
 
    if(verification !== undefined){
        updates.push("verification=?")
        values.push(verification)
    }

    if (updates.length > 0) {
      values.push(id)
      db.prepare(`
        UPDATE articles
        SET ${updates.join(", ")},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(...values)
    }


    // Update category
    if (category_name !== undefined) {
      db.prepare(`
        UPDATE categories
        SET category_name = ?
        WHERE id = ?
      `).run(category_name, article.category_id)
    }

    //Update author
    if (author_name !== undefined) {
      db.prepare(`
        UPDATE users
        SET author_name = ?
        WHERE id = ?
      `).run(author_name, article.author_id)
    }


    }) 

   try {
    transaction()

    res.status(200).send("Article updated successfully")
   }catch(err){
        return res.status(500).send(err)
   }

})


module.exports = routes