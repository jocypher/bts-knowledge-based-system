"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/article", require("./routes/articles"));
app.listen(PORT, () => {
    console.log("Server running on 4000");
});
