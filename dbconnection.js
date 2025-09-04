import mysql from 'mysql';

export const connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecom_project',
    port: 3306
})


connection.connect((err)=>{
    if(err){
        console.log("error connecting to db",err);
        return;
    }
    console.log("db connected successfully");
});