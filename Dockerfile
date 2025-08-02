# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy lockfile and package.json
COPY pnpm-lock.yaml package.json ./

# Install dependencies (includes devDependencies by default)
RUN pnpm install

# Copy all files
COPY . .

# Build React
RUN pnpm build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
