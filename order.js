import express from "express";
import { authguard } from "./auth.js";
import { connection } from "./dbconnection.js";

const router = express.Router();

router.post("/place", authguard, (req, res) => {
    const userId = req.user.userid;

    
    const cartQuery = "SELECT pid FROM cart WHERE userid=?";
    connection.query(cartQuery, [userId], (err, cartItems) => {
        if (err) return res.status(500).json({ error: true, message: "Database error" });
        if (cartItems.length === 0) return res.status(400).json({ error: true, message: "Cart is empty" });

       
        const insertOrderQuery = "INSERT INTO order (userid, order_date) VALUES (?, NOW())";
        connection.query(insertOrderQuery, [userId], (err, orderResult) => {
            if (err) return res.status(500).json({ error: true, message: "Failed to create order" });

            const orderId = orderResult.insertId;

            const orderItemsValues = cartItems.map(item => [orderId, item.pid]);
            const insertItemsQuery = "INSERT INTO order_items (order_id, pid) VALUES ?";
            connection.query(insertItemsQuery, [orderItemsValues], (err) => {
                if (err) return res.status(500).json({ error: true, message: "Failed to add order items" });

                const clearCartQuery = "DELETE FROM cart WHERE userid=?";
                connection.query(clearCartQuery, [userId], (err) => {
                    if (err) console.log("Failed to clear cart", err);

                    res.status(200).json({
                        error: false,
                        message: "Order placed successfully",
                        data: { orderId }
                    });
                });
            });
        });
    });
});

export default router;
