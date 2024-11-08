import express from "express";
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import userRoute from './routes/user.route';

app.use('/api/v1/users', userRoute);

export default app;