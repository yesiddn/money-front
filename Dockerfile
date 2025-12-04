# Etapa 1: Build (Compilación)
FROM node:22-alpine AS build

# Habilitar pnpm mediante corepack (la forma moderna y recomendada)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copiamos los archivos de definición de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias usando pnpm
# --frozen-lockfile asegura que se instalen las versiones exactas del lockfile
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN pnpm run build

# Etapa 2: Producción (Nginx)
FROM nginx:alpine

COPY --from=build /app/dist/money-front/browser /usr/share/nginx/html

# Configuración Nginx para SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
