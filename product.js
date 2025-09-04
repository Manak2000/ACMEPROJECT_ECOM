import express from 'express'
import { authguard } from "./auth.js";
import { connection } from "./dbconnection.js";
const router = express.Router();


router.post("/upload", authguard, (req, res) => {


    console.log("decode data in request:", req.user);

    console.log("product data", req.body);

    //insert into product table
    // Insert product_name,price,detail,owner


    const query = `INSERT INTO product (name, price, detail, owner) VALUES (?,?,?,?)`;
    const values = [req.body.name, req.body.price, req.body.detail, req.user.userid];

    connection.query(query, values, (err, dbresult) => {
        if (err) {
            console.log("error executing query", err);
            res.status(500).send("something went wrong ");
            return;
        }
        res.status(201).json({
            error: false,
            message: "product executed successfully", data: {
                productid: dbresult.insertId
            }
        });
    }
    );

});

router.get('/getall', authguard, (req, res) => {
    const role=req.user.role.toLowerCase()
    let query = `SELECT * FROM product `;
    let values=[];
    
if(role==="vendor"){
     query = `SELECT * FROM product where owner=?`; 
     values = [req.user.userid];
}
else{}
    connection.query(query,values, (err, dbresult) => {   
        if (err) {
            console.log("DB error:", err);
            res.status(500).json({ error: true, message: "something went wrong" });
            return;
        }
        res.status(200).json({
            error: false,
            message: "products fetched successfully",
            data: dbresult
        });
    });
});

router.delete("/delete/:pid", authguard, (req, res) => {
    const { pid } = req.params;
    const query = "DELETE FROM product WHERE pid = ?";
    connection.query(query, [pid], (err, dbresult) => {
        if (err) {
            console.error("Delete error:", err);
            return res.status(500).json({ error: true, message: "Something went wrong" });
        }

        if (dbresult.affectedRows === 0) {
            return res.status(404).json({ error: true, message: "Product not found" });
        }

        res.status(200).json({ error: false, message: "Product deleted successfully" });
    });
});
export default router;