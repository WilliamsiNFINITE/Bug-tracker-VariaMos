FROM node:16

# Create client folder
WORKDIR /client

# Copy config files
COPY package*.json ./
COPY tsconfig.json ./
COPY cypress.config.ts ./

# Copy source code
COPY ./ . 

RUN npm install --legacy-peer-deps

# Run client development server
CMD ["npm", "start"]
