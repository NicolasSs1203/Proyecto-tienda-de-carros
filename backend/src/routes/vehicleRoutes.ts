import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los vehículos
router.get('/', async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
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

export default router;
