import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleRoutes from './routes/vehicleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/vehicles', vehicleRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Root endpoint to prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de la Tienda de Autos', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
