FROM node:18-alpine

WORKDIR /app

# Copier package.json + package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste du code
COPY . .

# Exposer le port 4001
EXPOSE 4001

# Commande de démarrage
CMD ["npm", "start"]
