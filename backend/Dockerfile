# ---- Base: dependency umum untuk semua stage ----
FROM node:20-slim AS base
WORKDIR /app
# python3/make/g++ untuk jaga-jaga kalau ada native module yang tetap butuh compile dari source
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./

# ---- Development: dipakai docker-compose untuk kerja sehari-hari ----
FROM base AS development
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# ---- Build: compile TypeScript untuk production ----
FROM base AS build
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Production: image final, ramping tanpa devDependencies ----
FROM node:20-slim AS production
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "start"]