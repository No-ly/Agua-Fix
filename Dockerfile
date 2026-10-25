FROM node:22-alpine

WORKDIR /app

# 1. Primero solo los manifiestos: Docker cachea esta capa mientras no cambien las dependencias
COPY package.json package-lock.json ./
RUN npm ci

# 2. Luego el código fuente y la compilación de TypeScript a dist/
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
