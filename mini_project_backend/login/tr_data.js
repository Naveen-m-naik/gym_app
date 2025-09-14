const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { message } = require('statuses');
const { Client } = require('undici-types');

const server = express();
server.use(express.json());
server.use(cors());

mongoose.connect('mongodb://localhost:27017/trainerdata')
.then(() => console.log('Database is connected'))
.catch((err) => console.log('Database connection error:', err));

const userSchema = new mongoose.Schema({
  Trainername: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gymName: { type: String, required: true },
  timings: { type: String },
  fees: { type: Number, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Trainer = mongoose.model('Trainer', userSchema);

server.post('/trainerdata', async (req, res) => {
  try {
    const { Trainername, email, phone, gymName, timings, fees, username, password } = req.body;
    const phonenumber_1 = await Trainer.findOne({phone})
    if(phonenumber_1){
      return res.json({message:'You have already account'})
    }

    const emailExists = await Trainer.findOne({ email });
    if (emailExists) {
      return res.json({ message: 'Email already exists' });
    }

    const usernameExists = await Trainer.findOne({ username });
    if (usernameExists) {
      return res.json({ message: 'Username already exists' });
    }

    const add = new Trainer({ Trainername, email, phone, gymName, timings, fees, username, password });
    await add.save();

    res.json({ message: 'account is created' });
  } catch (err) {
    if (err.code === 11000) {
      if (err.keyPattern && err.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (err.keyPattern && err.keyPattern.username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    res.status(400).json({ error: err.message });
  }
});

server.get("/alltrainers", async (req, res) => {
  try {
    const trainers = await Client.find(); // Trainer is your model
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
});



server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
