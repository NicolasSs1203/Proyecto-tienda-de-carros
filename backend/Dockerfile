# Usa una imagen de Node oficial como base
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instala todas las dependencias (incluidas las devDependencies para poder compilar)
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el código TypeScript a JavaScript
RUN npm run build

# Genera el cliente de Prisma
RUN npx prisma generate

# Expone el puerto que la app usará
EXPOSE 3001

# Comando para iniciar la aplicación desde la versión compilada
CMD ["node", "dist/index.js"]
