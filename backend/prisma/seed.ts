import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cars = [
  {
    brand: "Subaru",
    model: "WRX STI",
    year: 2004,
    // Eliminamos el '$' y los puntos, y lo pasamos a float
    price: 136500000,
    description: "300 hp • 0-60 4.6s • Velocidad máxima 248 km/h",
    imageUrl: "/imagenes/carros/Subaru-Impreza_WRX_STi-2004-Front_Three-Quarter.6c2f7bfa.jpg"
  },
  {
    brand: "Toyota",
    model: "Corolla Sedan",
    year: 2024,
    price: 114900000,
    description: "169 hp • 0-60 8.2s • Velocidad máxima 188 km/h",
    imageUrl: "/imagenes/carros/Toyota-Corolla_Sedan_EU-Version-2019-wallpaper.jpg"
  },
  {
    brand: "Chevrolet",
    model: "Corvette Z06",
    year: 2024,
    price: 439500000,
    description: "670 hp • 0-60 2.6s • Velocidad máxima 304 km/h",
    imageUrl: "/imagenes/carros/Chevrolet-Corvette_Z06-2023-Front_Three-Quarter.bbfde54d.jpg"
  },
  {
    brand: "Chevrolet",
    model: "Cruze",
    year: 2016,
    price: 56000000,
    description: "153 hp • 0-60 7.7s • Velocidad máxima 201 km/h",
    imageUrl: "/imagenes/carros/Chevrolet-Cruze-2016-Front_Three-Quarter.729308c5.jpg"
  },
  {
    brand: "Mercedes-AMG",
    model: "GT R",
    year: 2021,
    price: 616200000,
    description: "577 hp • 0-60 3.5s • Velocidad máxima 318 km/h",
    imageUrl: "/imagenes/carros/Mercedes-Benz-AMG_GT63_S_E_Performance-2025-Front_Three-Quarter.45cfd2d0.jpg"
  },
  {
    brand: "McLaren",
    model: "750S",
    year: 2024,
    price: 1263600000,
    description: "740 hp • 0-60 2.7s • Velocidad máxima 332 km/h",
    imageUrl: "/imagenes/carros/McLaren-750S-2024-HD.jpg"
  },
  {
    brand: "Porsche",
    model: "911 GT3",
    year: 2024,
    price: 713300000,
    description: "502 hp • 0-60 3.2s • Velocidad máxima 318 km/h",
    imageUrl: "/imagenes/carros/Porsche-911_GT3-2014-wallpaper.jpg"
  },
  {
    brand: "Nissan",
    model: "GT-R",
    year: 2014,
    price: 292500000,
    description: "545 hp • 0-60 2.9s • Velocidad máxima 315 km/h",
    imageUrl: "/imagenes/carros/Nissan-GT-R-2014-wallpaper.jpg"
  },
  {
    brand: "BMW",
    model: "M3 E30",
    year: 1990,
    price: 275000000,
    description: "192 hp • 0-60 6.7s • Velocidad máxima 235 km/h",
    imageUrl: "/imagenes/carros/BMWE30.jpg"
  }
];

async function main() {
  console.log('Iniciando subida de datos ("seeding")...');
  
  for (const car of cars) {
    const vehicle = await prisma.vehicle.create({
      data: car,
    });
    console.log(`Vehículo creado: ${vehicle.brand} ${vehicle.model}`);
  }
  
  console.log('¡Todos los autos han sido guardados en la BD de Render exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
