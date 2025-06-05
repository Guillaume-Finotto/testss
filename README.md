# Projet Breezy

## Introduction
Breezy est un réseau social léger et réactif, inspiré de Twitter/X, optimisé pour des environnements à faibles ressources. 

## Structure du projet
```
breezy-project/
├─ auth-service/
├─ user-service/
├─ post-service/
├─ interaction-service/
├─ moderation-service/
├─ breezy-client/
├─ docker-compose.yml
└─ README.md
```

## Démarrage
1. Copier les fichiers `.env.example` vers `.env` dans chaque service et remplir les valeurs.
2. Lancer les migrations Sequelize dans chaque service (si désiré).
3. Depuis la racine, exécuter :
   ```
   docker-compose up --build
   ```
   Cela lancera PostgreSQL et tous les microservices ainsi que l’application React.

## Accès
- Front-end : http://localhost:3000
- Auth-Service : http://localhost:4001
- User-Service : http://localhost:4002
- Post-Service : http://localhost:4003
- Interaction-Service : http://localhost:4004
- Moderation-Service : http://localhost:4005
