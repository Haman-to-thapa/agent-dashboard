import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db';
import authRoutes from './routes/auth'
import aiRoutes from './routes/docRoutes'
import apiRoutes from './routes/search'

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
connectDB(process.env.MONGO_URI as string);

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use('api/search', apiRoutes)




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));