import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';

const app = express();

await connectDB();

// middlewares
app.use(cors());
app.use(express.json());


// Routes
app.get('/',(req,res) => res.send('Backend Sever is Working') )
app.use('/api/admin',adminRouter)
app.use('/api/blog',blogRouter)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
    
})

export default app;