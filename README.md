# Node.js + Express + MongoDB Learning Project

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongodb&logoColor=white)

> A learning project to understand backend development with Node.js, Express, and MongoDB.  
> Focused on models, controllers, routes, middlewares, file uploads, and real-time chat.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [Usage Examples](#usage-examples)  
- [Real-Time Chat](#real-time-chat)  
- [File Uploads](#file-uploads)  
- [Learning Goals](#learning-goals)  
- [License](#license)  

---

## Features

- **MongoDB Models** – Define entities using Mongoose schemas.  
- **Controllers** – Separate business logic from routes for cleaner code.  
- **Routes** – Organize API endpoints clearly.  
- **Middlewares** – Handle authentication, validation, and access control.  
- **Configs** – Store database and environment configurations.  
- **Utils** – Helper functions for repeated logic.  
- **Real-Time Chat** – Messaging with Socket.IO.  
- **File Uploads** – Upload images and other files using Multer.  

---

## Tech Stack

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- Socket.IO  
- Multer  

---

## Project Structure (Editor View)

Open your project in a code editor like VS Code, and it should look like this:

project/
├── src/
│   ├── configs/
│   │   ├── database.js          # MongoDB connection configuration
│   │   ├── socket.js           # Socket.io configuration
│   │   └── multer.js           # File upload configuration
│   │
│   ├── models/
│   │   ├── User.js             # User entity model
│   │   ├── Chat.js             # Chat entity model
│   │   ├── Message.js          # Message entity model
│   │   └── File.js             # File upload entity model
│   │
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── userController.js   # User management
│   │   ├── chatController.js   # Chat operations
│   │   └── fileController.js   # File upload handling
│   │
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── userRoutes.js       # User-related endpoints
│   │   ├── chatRoutes.js       # Chat API endpoints
│   │   └── fileRoutes.js       # File upload endpoints
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js   # Authentication verification
│   │   ├── validationMiddleware.js # Request validation
│   │   └── uploadMiddleware.js # File upload validation
│   │
│   ├── utils/
│   │   ├── helpers.js          # General helper functions
│   │   ├── validators.js       # Validation utilities
│   │   ├── fileHandler.js      # File processing utilities
│   │   └── socketEvents.js     # Socket event handlers
│   │
│   ├── sockets/
│   │   └── chatSocket.js       # Real-time chat socket logic
│   │
│   ├── uploads/                # Uploaded files storage
│   │   ├── images/
│   │   └── documents/
│   │
│   └── app.js                  # Express application setup
│
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
