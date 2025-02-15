# Stage 1: Build application
FROM node:23.3.0 AS builder

# Set working directory
WORKDIR /jarvis-helpdesk-ai-module

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
WORKDIR /jarvis-helpdesk-ai-module

# Copy only the built application and necessary files from the builder stage
COPY --from=builder /jarvis-helpdesk-ai-module/dist ./dist
COPY --from=builder /jarvis-helpdesk-ai-module/package.json ./
COPY --from=builder /jarvis-helpdesk-ai-module/yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start:prod"]
