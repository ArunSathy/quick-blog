import express from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());


// Routes
app.get('/',(req,res) => res.send('Backend Sever is Working') )


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
    
})

export default app;