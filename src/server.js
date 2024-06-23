import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import env from 'dotenv';
import db from './connections/connection.db.js';

const app = express();
env.config();

// CORS middleware
app.use(cors());

// import Routers
import categoryRouter from './routers/router.category.js';
import productRouter from './routers/router.product.js';
import orderRouter from './routers/router.order.js';
import reportRouter from './routers/router.reports.js';
import brandRouter from './routers/router.brand.js';
import bannerRouter from './routers/router.banner.js';

// import Middlewares
import errorHandler from './middlewares/errorHandler.js';
import GeneralError from './errors/generalError.js';

//base url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, '..', 'Uploads')));

app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/report', reportRouter);
app.use('/api/brand', brandRouter);
app.use('/api/banner', bannerRouter);
// app.use("/api/user");

// Catch all route for 404 errors
app.use((req, res, next) => {
	next(GeneralError.notFound('Route not found'));
});

// Error handling middleware
app.use(errorHandler);

// Server Port
const PORT = process.env.PORT || 8000;

const start = async () => {
	try {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}:...`);
		});

		await db.authenticate();
		console.log('Connection has been established successfully.');

		// await db.sync({ force: true });
		// console.log('Database synchronized');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};
start();
