FROM node:16

# Create server folder
WORKDIR /server

# Copy config files
COPY package*.json ./
COPY tsconfig.json ./

# Copy source code
COPY ./ . 

RUN npm install

EXPOSE 3000

# Run backend development server
CMD ["npm", "run", "dev"]