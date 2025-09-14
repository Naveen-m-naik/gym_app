const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { message } = require('statuses');

const server = express();
server.use(express.json());
server.use(cors());

mongoose.connect('mongodb://localhost:27017/trainerdata').then
console.log('database is connected ')
.catch((err)=>console.log(err))

const usershema = new mongoose.Schema(   {}, { strict: false })
const Trainer = mongoose.model('Trainer',usershema);

server.post('/login',async (req, res) => {
    const {username,password} = req.body;
    const existusername = Trainer.findOne({username})
    if(!existusername){
        return res.json({message:''})
    }
    const isMatch = await bcrypt.compare(password, Trainer.password);
        if (!isMatch){
            return res.json({ message: 'Invalid password' });
        } 
        return res.json({message:'login sucessful'})
})




 
