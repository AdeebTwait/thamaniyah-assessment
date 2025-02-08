FROM node:20-alpine

WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache \
    netcat-openbsd \
    openssl \
    libc6-compat

# Install global npm packages
RUN npm install -g cross-env

# First copy only package files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

RUN chmod +x scripts/init.sh

EXPOSE 8000

CMD ["sh", "./scripts/init.sh"]