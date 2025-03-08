# To-Do List Application

### 📌 Student Information
- **Student ID:** 22653431
- **Full Name:** Trần Phú Thọ

## 🚀 Overview
This is a **simple and efficient To-Do List application** built with **Node.js, Express, and JSON for data storage**.  
The app allows users to **add, edit, delete, mark tasks as completed, and manage user accounts**.

---

## 📎 Project Setup

### 1⃣ **Open the Project Folder**
Make sure you are in the correct project directory before running commands:
```sh
cd /path/to/todolist
```

### 2⃣ **Install Dependencies**
Run the following command to install required Node.js dependencies:
```sh
npm install
```

### 3⃣ **Start the Server**
Run the server using:
```sh
npm start
```
By default, the application will be available at:  
👉 **http://localhost:3000**

### 5⃣ **Stop the Server**
To stop the server, press:
```sh
Ctrl + C
```

---

## 📌 Features
✅ **User Authentication** (Login, Register)  
✅ **Admin Panel** (Manage Users & Tasks)  
✅ **Task Management** (CRUD operations)  
✅ **Pagination & Sorting**  
✅ **Session-based Authentication**  
✅ **Docker Support**  

---

## 🐳 Running with Docker
You can also run this application using **Docker**:

### 1⃣ **Build Docker Image**
```sh
docker build -t todo-list-app .
```

### 2⃣ **Run Docker Container**
```sh
docker run -p 3000:3000 --name todo-list-container -d todo-list-app
```

### 3⃣ **Stop & Remove Container**
```sh
docker stop todo-list-container
docker rm todo-list-container



🚀 **Happy Coding!** 🎯

