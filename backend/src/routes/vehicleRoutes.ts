import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

// Configurar transportador de correo SMTP de Google (Host Explícito para la nube)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Usar conexión TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

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
  const { brand, model, year, price, description, imageUrl } = req.body;
  try {
    const newVehicle = await prisma.vehicle.create({
      data: { brand, model, year, price, description, imageUrl },
    });
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear vehículo' });
  }
});

// Actualizar un vehículo
router.put('/:id', async (req: Request, res: Response) => {
  const { brand, model, year, price, description, imageUrl } = req.body;
  try {
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: Number(req.params.id) },
      data: { brand, model, year, price, description, imageUrl },
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
    const userEmail = req.user?.email || 'Cliente';

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

    // Enviar factura si el email y credenciales SMTP existen
    console.log("-> Intento de Facturación. Correo Cliente:", userEmail);
    console.log("-> Variables GMAIL Cargadas?:", !!process.env.GMAIL_USER, !!process.env.GMAIL_PASS);
    
    if (userEmail && process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
      
      const mailOptions = {
        from: `"CARROS MOTORS" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Factura: ${vehicle.brand} ${vehicle.model} - Compra Exitosa`,
        html: `
          <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#09090b; color:#ffffff; padding:40px 20px; border-radius:15px; max-width:600px; margin:0 auto; border: 1px solid #27272a;">
            <div style="text-align:center; padding-bottom:20px; border-bottom:1px solid #27272a;">
              <h1 style="color:#e11d48; letter-spacing: 2px; text-transform:uppercase; margin:0;">Carros Motors</h1>
              <p style="color:#a1a1aa; font-size:14px;">Factura Oficial de Compra</p>
            </div>
            
            <div style="padding: 30px 0;">
              <h2>¡Hola, apasionado de los motores!</h2>
              <p style="color:#d4d4d8; line-height:1.6;">Tu compra ha sido procesada con éxito. Este recibo sirve como comprobante de tu nueva adquisición. A continuación, el detalle de tu vehículo:</p>
              
              <div style="background-color:#18181b; border: 1px solid #27272a; border-radius:10px; padding:20px; margin: 25px 0;">
                <p style="margin:5px 0; color:#a1a1aa;">Vehículo:</p>
                <h3 style="margin:5px 0 15px 0; font-size:22px; color:white;">${vehicle.year} ${vehicle.brand} ${vehicle.model}</h3>
                <img src="${vehicle.imageUrl || 'https://via.placeholder.com/400x200?text=Auto'}" alt="${vehicle.model}" style="width:100%; border-radius:8px; margin-bottom:15px; border:1px solid #3f3f46;" />
                
                <table style="width:100%; border-top:1px dashed #3f3f46; padding-top:15px;">
                  <tr>
                    <td style="color:#a1a1aa; padding:5px 0;">Nº de Transacción:</td>
                    <td style="text-align:right; font-family:monospace;">TRX-${Date.now().toString().slice(-6)}</td>
                  </tr>
                  <tr>
                    <td style="color:#a1a1aa; padding:5px 0;">Fecha:</td>
                    <td style="text-align:right;">${new Date().toLocaleDateString('es-CO')}</td>
                  </tr>
                  <tr>
                    <td style="color:#e11d48; font-weight:bold; font-size:18px; padding-top:15px;">Total Pagado:</td>
                    <td style="text-align:right; color:#e11d48; font-weight:bold; font-size:18px; padding-top:15px;">${formatter.format(vehicle.price)}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div style="text-align:center; font-size:12px; color:#52525b; border-top:1px solid #27272a; padding-top:20px;">
              Este es un correo automático. Por favor, no respondas a este mensaje.
              <br>© ${new Date().getFullYear()} Carros Motors Inc. Todos los derechos reservados.
            </div>
          </div>
        `
      };
      
      // Enviamos el correo en segundo plano
      transporter.sendMail(mailOptions)
        .then(() => console.log("-> ¡Correo enviado satisfactoriamente por Nodemailer!"))
        .catch(err => console.error("-> Error de Nodemailer:", err));
    } else {
      console.log("-> ⚠️ Cancelando envío. Faltan variables o email.");
    }

    res.json({ message: '¡Felicidades por tu compra!', vehicle: updatedVehicle });
  } catch (error) {
    console.error("Error en la compra:", error);
    res.status(500).json({ error: 'Error al procesar la transacción de compra' });
  }
});

export default router;
