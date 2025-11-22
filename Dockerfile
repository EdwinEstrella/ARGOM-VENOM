FROM node:22-alpine

WORKDIR /app

# Instalar dependencias necesarias para build
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración primero para caché de Docker
COPY package*.json ./

# Limpiar caché antes de instalar dependencias
RUN rm -rf node_modules/.cache || true

# Instalar dependencias con overrides para evitar warnings
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Limpiar dependencias de desarrollo después del build
RUN npm prune --production

# Exponer puerto
EXPOSE 3000

# Comando de inicio para servir archivos estáticos
CMD ["node", "server.js"]