# Habit Hero: Build Better Routines 🚀

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway"/>
</p>

Habit Hero is a full-stack web application designed to help users create, track, and analyze their habits to build consistent, positive routines.

**Live Frontend (Vercel):** https://habit-hero-gamma.vercel.app/

**Live Backend (Railway):** https://habit-hero-production-23e4.up.railway.app/

---

### ⚠️ Deployment Note

The application is **fully functional in the local development environment**. There is a persistent cross-origin (CORS) issue with the deployed version that prevents the live frontend from authenticating with the live backend.

**To review the fully functional application, please follow the local setup instructions below.**

---

## 📸 Screenshots

Here are a few glimpses of the Habit Hero application in action.

*To add your own screenshots, take a picture of your running application, drag the image file into your GitHub repository, and then replace the placeholder links below with the new links to your images.*

**Main Dashboard (Dark Theme)**
![Dashboard View](https://placehold.co/600x400/1f2937/fde047?text=Dashboard)

**Analytics & Gamification**
![Analytics Page](https://placehold.co/600x400/f9fafb/1f2937?text=Analytics+Page)

**Add/Edit Habit Modal**
![Add Habit Modal](https://placehold.co/600x400/ffffff/1f2937?text=Add+Habit+Modal)

---

## ✨ Features

This project successfully implements all core requirements and several optional features, providing a rich user experience.

#### ✅ Core Features

* **User Authentication**: Secure sign-up and sign-in functionality.
* **Habit Creation**: Users can create habits with a **name**, **frequency** (daily/weekly), **category**, and a **start date**.
* **Progress Tracking**: Daily **check-ins** to mark habits as complete and a dedicated **notes** section for each habit.
* **Dynamic Dashboard**: A central hub to view and interact with all current habits.
* **Analytics Page**: A dedicated page to visualize progress with metrics like **streaks** and daily **success rate**.
* **Categorization**: Organize habits into categories like Health, Work, and Learning, including custom user-defined categories.

#### 🌟 Optional & Advanced Features

* **Gamification**: An **achievements system** where users unlock badges for milestones (e.g., "Perfect Week," "First Habit Created").
* **AI Habit Coach**: An interactive section that provides **AI-powered suggestions** for new habits based on the user's selected goals.
* **Full CRUD Functionality**: Users have complete control to **edit** and **delete** their habits.
* **Modern UI/UX**: A clean, responsive design with a **light/dark theme toggle** and smooth animations.

---

## 🛠️ Tech Stack

* **Frontend**: React.js
* **Backend**: Python (Flask)
* **Database**: MongoDB (with MongoDB Atlas)
* **Authentication**: JWT (JSON Web Tokens)
* **Deployment**: Vercel (Frontend), Railway (Backend)

---

## 💻 Local Setup Instructions

To run the fully functional application on your local machine, please follow these steps.

### Prerequisites

* Node.js & npm
* Python & pip
* A MongoDB Atlas account (or a local MongoDB instance)

### Backend Setup

1.  Navigate to the `src/backend` directory.
2.  Create a file named `.env`.
3.  Add your `MONGO_URI` connection string and a `JWT_SECRET_KEY` to the `.env` file.
4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Start the backend server:
    ```bash
    flask run
    ```
    The backend will be running at `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the `src/frontend` directory.
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend application:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.
