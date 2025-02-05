# Use a specific Node.js version for better reproducibility
FROM node:23.3.0-slim AS builder

# Install pnpm globally and install necessary build tools
RUN npm install -g pnpm@9.15.1 && \
    apt-get update && \
    apt-get install -y git python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set Python 3 as the default python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Create dist directory and set permissions
RUN chown -R node:node /app && \
    chmod -R 755 /app

USER node

# Set the working directory
FROM node:23.3.0-slim

# Install runtime dependencies if needed
RUN npm install -g pm2
RUN apt-get update && \
    apt-get install -y git python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app && mkdir -p /programs
COPY ./app /app

# Set the working directory in the container
WORKDIR /app

RUN npm install
    
# Expose the port that the app will run on
EXPOSE 3000

# # Command to run the app (start PM2 if you want to use it to manage your app)
CMD ["pm2-runtime", "ecosystem.config.js "]
