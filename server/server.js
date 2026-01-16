import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'; 
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express";


const app= express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
}));
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});

app.get('/', (req, res) => res.send('Server is Running'));

app.use('/api/inngest', serve({ client: inngest, functions }));

export default app;