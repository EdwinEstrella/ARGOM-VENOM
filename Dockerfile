FROM node:22-alpine

WORKDIR /app

# Instalar dependencias necesarias para build
RUN apk add --no-cache python3 make g++

# Configurar npm para evitar caché problemático
RUN npm config set cache /tmp/.npm --global && \
    npm config set fund false --global && \
    npm config set audit false --global

# Copiar archivos de configuración primero
COPY package*.json ./

# Instalar dependencias de producción (sin caché que cause conflictos)
RUN npm ci --omit=dev --no-audit --no-fund

# Copiar el resto del código
COPY . .

# Instalar dependencias de desarrollo y construir
RUN npm install --include=dev --no-audit --no-fund && \
    npm run build

# Limpiar dependencias de desarrollo después del build
RUN npm prune --production

# Limpiar cualquier caché residual
RUN rm -rf /tmp/.npm || true && \
    rm -rf node_modules/.cache || true

# Exponer puerto
EXPOSE 3000

# Comando de inicio para servir archivos estáticos
CMD ["node", "server.js"]