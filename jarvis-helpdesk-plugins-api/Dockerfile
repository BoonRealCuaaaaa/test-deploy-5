# Stage 1: Build application
FROM node:23.3.0 AS builder

# Set working directory
WORKDIR /jarvis-helpdesk-plugin-api

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the application
RUN yarn build

# Stage 2: Run application
FROM node:23.3.0

# Set working directory
WORKDIR /jarvis-helpdesk-plugin-api

# Copy only the built application and necessary files from the builder stage
COPY --from=builder /jarvis-helpdesk-plugin-api/dist ./dist
COPY --from=builder /jarvis-helpdesk-plugin-api/package.json ./
COPY --from=builder /jarvis-helpdesk-plugin-api/yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Command to run the application
CMD ["sh", "-c", "yarn migration:run:prod && yarn start:prod"]
