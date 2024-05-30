import express from 'express';
import env from 'dotenv';
import { SequalizeORM } from './connections/connect.js';

const app = express();
env.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/api/category");
// app.use("/api/product");
// app.use("/api/order");
// app.use("/api/user");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}:...`);
	SequalizeORM.connectDB();
});
