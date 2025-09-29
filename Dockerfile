# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install 

# COPY . .
# RUN npm run build

# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production

# COPY --from=builder /app/dist ./dist

# CMD ["node", "dist/main.js"]

# EXPOSE 3000


FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]
