import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los vehículos disponibles
router.get('/', async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { isSold: false }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
});

// Obtener un vehículo por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ error: 'Vehículo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículo' });
  }
});

// Crear un vehículo
router.post('/', async (req: Request, res: Response) => {
  try {
    const newVehicle = await prisma.vehicle.create({
      data: req.body,
    });
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear vehículo' });
  }
});

// Actualizar un vehículo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar vehículo' });
  }
});

// Eliminar un vehículo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.vehicle.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
});

// Comprar un vehículo
router.post('/:id/buy', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vehicleId = Number(req.params.id);
    const userId = req.user?.userId;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!vehicle) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }

    if (vehicle.isSold) {
      res.status(400).json({ error: 'Este auto ya ha sido vendido a otro cliente.' });
      return;
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        isSold: true,
        buyerId: userId
      }
    });

    res.json({ message: '¡Felicidades por tu compra!', vehicle: updatedVehicle });
  } catch (error) {
    console.error("Error en la compra:", error);
    res.status(500).json({ error: 'Error al procesar la transacción de compra' });
  }
});

export default router;
