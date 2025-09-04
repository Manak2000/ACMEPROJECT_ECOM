import { Router } from "express";
import { connection } from './dbconnection.js';
import jwt from "jsonwebtoken";
const router = Router();
export default router;

var SECRET_KEY = "acmeintern"
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = "select userid,username,role from user where username =? and password=?";

    connection.query(query, [username, password], (err, dbreponse) => {
        console.log("login db response=", dbreponse);

        if (dbreponse.length == 0) {
            res.status(401).json({ error: true, message: "invalid credentials" });
            return;
        }
        const dataResponse = dbreponse[0];
        const payload = { userid: dataResponse.userid, username: dataResponse.username, role: dataResponse.role }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({ error: false, message: "login success", data: { role: dataResponse.role, token: token } });
    })

});


router.get('/logout', (req, res) => {
    res.send("logout endpoint");
});
//for a new user registration

router.post('/register', (req, res) => {
    console.log(req.body)

    const { username, password, role } = req.body

    const query = `INSERT INTO user (username,password,role) values (?,?,?)`;

    connection.query(query, [username, password, role], (err, dbresult) => {
        if (err) {
            console.log("error executing query", err);
            res.status(500).send("database error ");
            return;
        }
        console.log("query executed successfully", dbresult);
    })
    res.send("registration endpoint");
});

// for secret key and token verification
export function authguard(req, res, next) {
    const token = req.headers.authorization
    console.log(req.headers.authorization);
    if (!token) {
        return res.status(403).json({ error: true, message: "No token provided" });
    }
    jwt.verify(token, SECRET_KEY, (err, decodedpayload) => {
        if (err) {
           res.status(403).send({ error: true, message: "token verification failed" })
        }
        else {
            console.log("decoded payload:", decodedpayload);
            req.user = decodedpayload;
            next();
        }

    })
    console.log("response is triggered");

}