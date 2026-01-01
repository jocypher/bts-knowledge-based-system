"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_1 = __importDefault(require("./routes/articles"));
const reqLog_1 = __importDefault(require("./middlewares/loggers/reqLog"));
const errorLogs_1 = __importDefault(require("./middlewares/loggers/errorLogs"));
const AppDataSource_1 = __importDefault(require("./datasource/AppDataSource"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(reqLog_1.default);
AppDataSource_1.default.initialize().then(() => {
    console.log("Data source has been initialized");
    app.use("/article", articles_1.default);
    app.use(errorLogs_1.default);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(`${err}`);
});
