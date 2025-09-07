import queryRoutes from './backend/routes/queryRoutes.js';
import aiRoutes from './backend/routes/aiRoutes.js';
import dbRouter from './backend/routes/dbRoutes.js';

import express from 'express';
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/queries', queryRoutes);
app.use('/api/ai', aiRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use(express.json());

app.use("/api/db", dbRouter);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));