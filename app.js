import express from "express";
import mongoose from "mongoose";
import router from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/user/",router);
app.use("/api/blog",blogRouter)
mongoose.connect('mongodb://localhost:27017/blogDB')
.then(()=>app.listen(5001))
.then(()=> console.log('Connected to blogDB!'))
.catch((err)=> console.log(err));


