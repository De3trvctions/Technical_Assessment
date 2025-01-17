# Use Node.js LTS version for stability
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the development server port
EXPOSE 3000

# Run the React app in development mode
CMD ["npm", "start"]
