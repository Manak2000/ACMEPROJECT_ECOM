import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './auth.js';
import productRouter from './product.js';
import cartRouter from './cart.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "http://127.0.0.1:3000" }));
app.use(bodyParser.json());

// Serve frontend folder
app.use("/frontend", express.static(path.join(__dirname, "front_end")));
app.use("/cart", cartRouter);
// Routes
app.use('/auth', authRouter);
app.use('/product', productRouter);

app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");
});



//HAD TO MAKE SOME CHANGES SO IGNORE THE PROBLEMS WITH SERVER KALIDAS SIR.





// app.get('/', (req, res) => {
//     res.send("hello world");
// });

// app.get("/health/:data", guard, handler2);

// function guard(req,res,next){
//     let data= req.params.data;
//     console.log(`data received: ${data},${typeof data}`);
//     if(isNaN(data)!=NaN){
//         res.status(400).send("invalid data");
//         return;
//     }
//     else{
//         next();
//     }


// }

// function handler2(req, res, next) {
//     console.log("handler 2 executed");
// res.send("health checked passed");
// }

