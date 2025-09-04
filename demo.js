import jwt from 'jsonwebtoken';

const SECRET="acmeadmin"

let payload={
    user:"admin",
    userid:123
}
const options={ expiresIn:"1h"}
var token=jwt.sign(payload,SECRET,options)

console.log("token:",token);

jwt.verify(token,SECRET,(err,decoded)=>{

    if(err){
        console.log("token verification failed:",err);
    }
        else{
            console.log("decoded payload",decoded);
    }
});

