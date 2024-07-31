const express=require('express');
const app=express();
const Pool=require('pg').Pool;
const cors=require('cors');

//use middleware
app.use(express.json());//used for parsing req.body
app.use(cors());//used for different domain application interaction

//creating a connection with postgres database in postgres sql
const pool=new Pool({
    user:'postgres',//its a super user in postgres sql which has all the access
    password:'Sujit@2001',
    host:'localhost',
    port:5432,
    database:'postgres' 
});

//handling various endpoints on the restful api
//create a todo
app.post('/todos',async(req,res)=>{
    try{
        console.log(req.body);
    const {description}=req.body;
    const addNewTodo=await pool.query("INSERT INTO TODO(description) values($1) Returning *",[description]);//for returning the data stored currently
    console.log(addNewTodo.rows[0]);
    console.log(`description is ${description}`);
    res.json(addNewTodo.rows[0]);
    }
    catch(err){
        console.error(err.message);
    }
});

//get all todos ,so here we are not sending any description neither endpoint url is dynamic
app.get("/todos",async(req,res)=>{
    try{
    const allTodos=await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
    console.log("GET ALL TODOS");
    console.log(allTodos.rows);
    }catch(err){
        console.error(err.message);
    }
});

//get a particular todo,with the help of dynamic url
app.get("/todos/:id",async(req,res)=>{
    try{
     const {id}=req.params;
     const getTodo=await pool.query("SELECT * FROM todo WHERE todo_id=$1",[id]);
     console.log("GET A PARTICULAR TODO");
     console.log(getTodo.rows[0]);
     res.json(getTodo.rows[0]);
    }catch(err){
        console.error(err.message);
    }
});


//update a todo ,where we will getting a todo and dynamic url
app.put("/todos/:id",async(req,res)=>{
    try{
    const {id}=req.params;//detstructing the req.params obj
    const {modalInput}=req.body;

    const updateTodo=await pool.query("UPDATE todo SET description=$1 WHERE todo_id=$2 Returning *",[modalInput,id]);
    res.json(updateTodo.rows[0]);
    console.log('UPDATE A TODO WITH ID ==${id}');
    console.log(updateTodo.rows[0]);
    }catch(err){
        console.error(err.message);
    }
});

//delete a todo depending on the dynamic url
app.delete('/todos/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const deletedTodo=await pool.query("DELETE FROM todo WHERE todo_id=$1 Returning *",[id]);
    console.log(deletedTodo.rows[0]);
    res.json(deletedTodo.rows[0]);
    }catch(err){
        console.error(err.message);
    }
})

//create table entry(name varchar(50),password varchar(20),phoneno varchar(20),email varchar(50),primary key(name,password));
app.post("/login",async(req,res)=>{
    try{
    const {name,password}=req.body;
    console.log(`login request is `);
    console.log(req.body);

    const checkEntry=await pool.query("select * from entry where password=$1 and name=$2",[password,name]);
    res.json(checkEntry.rows);
    // res.send(checkEntry.rows[0]);
    console.log("login response is");
    console.log(checkEntry);
    }
    catch(err){
        console.error(err.message);
    }
})

app.post("/signup",async(req,res)=>{
   try{
    const {name,password,phoneno,email}=req.body;
    console.log(`signup req is `);
    console.log(req.body);
    const checkEntry=await pool.query("INSERT INTO entry(name,email,password,phoneno) VALUES($1,$2,$3,$4) RETURNING *",[name,email,password,phoneno]);
    res.json(checkEntry.rows);
    console.log("signup response is");
    console.log(checkEntry.rows);

   }catch(err){
    console.error(err.message);
    const checkEntry=[];
    res.json(checkEntry);
    console.log("signup response is");
    console.log(checkEntry);
   }
})


app.listen(5000,()=>{
    console.log("server running on port 5000");
})