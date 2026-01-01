import logEvents  from "./logEvents";


const errorLogs = (err: any, req: any, res: any, next: any) => {
    // ↑ Must have 4 parameters in this order!
    logEvents(`${err.name}\t${err.message}`, "errorLog.txt")
    console.error("Error:", err.stack)
    return res.status(500).json({ 
        message: err.message || "Internal server error" 
    });
}

export default errorLogs