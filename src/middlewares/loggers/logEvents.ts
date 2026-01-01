import path from "path"
import fs from "fs"
import {format} from "date-fns"
import {v4 as uuidv4} from "uuid"
import * as fsPromises from "fs/promises"




const logEvents = async(message: string, logName: string) =>{
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`
    const logItem = `${dateTime}\t ${uuidv4()}\t ${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname,".." ,"logs"))){
            await fsPromises.mkdir(path.join(__dirname,".." ,"logs"))
        }
        await fsPromises.writeFile(path.join(__dirname, "..","logs", logName),logItem, {flag:"a"})
    }catch(err){
        console.log(err)
    }
}



export default logEvents