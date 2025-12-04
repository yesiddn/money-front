# Etapa 1: Build
FROM node:22-alpine AS build
# ... (tu configuración de pnpm igual que antes) ...
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Etapa 2: Debug (Temporal)
FROM nginx:alpine
# Copiamos todo el dist para ver qué hay
COPY --from=build /app/dist /tmp/debug_dist

# Listamos los archivos en el log del contenedor al arrancar
CMD ["sh", "-c", "ls -R /tmp/debug_dist && nginx -g 'daemon off;'"]
