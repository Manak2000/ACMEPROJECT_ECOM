import express from "express";
import { connection } from './dbconnection.js';

import { authguard } from "./auth.js";
const router = express.Router();
export default router;

router.post("/add", authguard, (req, res) => {

    const pid = req.body.pid;
    const userid = req.user.userid;
    const query = `INSERT INTO cart (pid,userid) VALUES (?,?)`;
    const values = [pid, userid];

    connection.query(query, values, (err, dbresult) => {
        if (err) {
            console.log("error executing query", err);
            res.status(500).send("something went wrong ");
            return;
        }
        res.status(201).json({
            error: false,
            message: "product added to cart successfully", data: {
                cartid: dbresult.insertId
            }
        });
    });
});



router.get("/getall", authguard, (req, res) => {
    const userid = req.user.userid;
    const query = `SELECT * from cart join product on cart.pid=product.pid where cart.userid=?`;
    const values = [userid];

    connection.query(query, values, (err, dbresult) => {
        if (err) {
            console.log("error executing query", err);
            res.status(500).send("something went wrong ");
            return;
        }
        res.status(200).json({
            error: false,
            message: "cart items fetched successfully", data: dbresult
        });
    });
});
