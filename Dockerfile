FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Build the Astro project
RUN npm run build

# Default port for Render
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Start the Node.js server created by Astro
CMD ["node", "./dist/server/entry.mjs"]
