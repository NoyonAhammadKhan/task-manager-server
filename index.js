const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4hum0hz.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
       
        const tasksCollection = client.db('TaskHandler').collection('tasks');

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            console.log(task);
            const result = await tasksCollection.insertOne(task);
            res.send(result)
        })
        app.get('/tasks/:id',async(req,res)=>{
            const id = req.params.id;
            const query={_id:ObjectId(id)}
            const result=await tasksCollection.findOne(query);
            res.send(result);
        })

        
        app.get('/mytasks/:email', async (req, res) => {
            const email=req.params.email;
            const query = {userEmail:email,completeStatus:'notcompleted'}
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/completedtasks/:email', async (req, res) => {
            const email=req.params.email;
            const query = {userEmail:email,completeStatus:'completed'}
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })
        app.patch('/tasks/completed/:id',async(req,res)=>{
            const id=req.params.id;
            const completeStatus=req.body.completeStatus;
            const query={_id:ObjectId(id)}
            const updatedDoc={
                $set:{
                    completeStatus:completeStatus
                }
            }
            const result=await tasksCollection.updateOne(query,updatedDoc);
            res.send(result);
        })
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(filter);
            res.send(result);
        })

        

        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            // const status = req.body.status;
            const taskName=req.body.taskName;
            const taskDetails = req.body.taskDetails;
            const taskImage = req.body.taskImage;
            const userEmail = req.body.userEmail;
            const completeStatus = req.body.completeStatus;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                     taskName:taskName,
                     taskDetails:taskDetails,
                     taskImage:taskImage,
                     userEmail:userEmail,
                     completeStatus:completeStatus
        
                }
            }
            const result = await tasksCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
        app.patch('/tasks/comment/:id', async(req,res)=>{
            const id = req.params.id;
            const comment= req.body.comment;
            const query={_id:ObjectId(id)}
            const updatedDoc ={
                $set:{
                    comment:comment
                }
            }
            const result = await tasksCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
   

        

    }
    finally {

    }


}
run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('This is home page')
})

app.listen(port, () => {
    console.log(`app is listening ${port}`)
})