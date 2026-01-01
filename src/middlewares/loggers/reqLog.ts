import logEvents from "./logEvents";




const logger = (req:any, res:any ,next:any)=>{
    logEvents(`${req.method}\t ${req.headers.origin}\t${req.url}\n`, 'reqLog.txt') 
    console.log(`${req.method}\t${req.path}`)
    next()
}




export default logger