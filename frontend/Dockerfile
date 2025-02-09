FROM node:20-alpine

WORKDIR /app

# Install dependencies required for development
RUN apk add --no-cache \
    libc6-compat \
    git

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Run in development mode with hot reloading
CMD ["npm", "run", "dev"] 