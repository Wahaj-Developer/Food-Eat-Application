# 🚀 Food View

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![ImageKit](https://img.shields.io/badge/ImageKit-Video%20Storage-7B61FF?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)



A full-stack food discovery and video-sharing platform where users can
explore short food videos, like and save their favorites, and visit
food-partner profiles. Food partners can register, upload food videos,
manage their posts, and present their food business through a dedicated
partner panel.



------------------------------------------------------------------------

# 📑 Table of Contents

-   [Project Overview](#-project-overview)
-   [Why This Project?](#-why-this-project)
-   [Key Features](#-key-features)
-   [System Architecture](#-system-architecture)
-   [Application Workflow](#-application-workflow)
-   [Project Structure](#-project-structure)
-   [Technologies Used](#-technologies-used)
-   [API Documentation](#-api-documentation)
-   [Getting Started](#-getting-started)
-   [Environment Variables](#-environment-variables)
-   [Application Screenshots](#-application-screenshots)
-   [Project Documentation](#-project-documentation)
-   [Challenges Faced](#-challenges-faced)
-   [Testing](#-testing)
-   [Deployment](#-deployment)
-   [Future Improvements](#-future-improvements)
-   [Learning Outcomes](#-learning-outcomes)
-   [Contributing](#-contributing)
-   [License](#-license)

------------------------------------------------------------------------

# 📖 Project Overview

Food View is a full-stack MERN application built around short-form food
videos.

The platform has two main types of accounts:

-   **Users** who discover food videos and interact with them.
-   **Food Partners** who represent food businesses and publish/manage
    their food videos.

The user experience is centered around a vertical reel feed similar to
modern short-video platforms. Users can watch food videos, like them,
save them for later, and open the food partner's profile.

Food partners get a dedicated management area where they can view their
profile, upload food videos, and delete their own posts.

The project demonstrates practical full-stack development using React,
Node.js, Express, MongoDB, JWT authentication, ImageKit storage, REST
APIs, responsive UI design, loading states, error handling, and reusable
React components.

------------------------------------------------------------------------

# 🌐 Live Demo

You can explore the application using the live demo below.

🔗 **Live Demo:** https://food-eat-web-application.vercel.app/user/login

------------------------------------------------------------------------

## 🚀 Getting Started

### New User?

If you don't have an account yet:

1.  Open the **Register** page.
2.  Choose whether to register as a **User** or **Food Partner**.
3.  Complete the registration form.
4.  The application authenticates the account using a JWT cookie.
5.  Start exploring Food View or managing your food-partner content.

------------------------------------------------------------------------

### Existing User?

Already have an account?

1.  Open the **Login** page.
2.  Choose **User** or **Food Partner** login.
3.  Enter your registered email and password.
4.  Continue to the appropriate part of the application.

------------------------------------------------------------------------

> **Note:** When the application is hosted on a free-tier backend
> service, the backend may go into sleep mode after inactivity. The
> user-side demo notice and food-partner demo alert communicate this
> behavior so a delayed first request is not mistaken for an application
> failure.

------------------------------------------------------------------------

# 💡 Why This Project?

Food discovery is highly visual, and traditional food listing interfaces
do not always provide an engaging way for users to discover new dishes
or businesses.

Food View explores a short-video-first approach by combining:

-   Food video discovery
-   User authentication
-   Food partner accounts
-   Video uploads
-   Cloud video storage
-   Like and save interactions
-   Food partner profiles
-   REST APIs
-   MongoDB data storage
-   Responsive React UI

The goal is to create a simple platform where users can discover food
visually while food businesses can publish their own content.

------------------------------------------------------------------------

# ⭐ Key Features

## 👤 Authentication

-   User Registration
-   User Login
-   User Logout
-   Food Partner Registration
-   Food Partner Login
-   Food Partner Logout
-   Separate User and Food Partner authentication flows
-   JWT-based authentication
-   Cookie-based authentication
-   Password hashing with bcryptjs
-   Authentication middleware for protected APIs
-   Account switching links between User and Food Partner login/register
    pages

------------------------------------------------------------------------

## 🍔 Food Discovery

-   Full-screen vertical food video feed
-   Reel-style scroll snapping
-   Automatic video playback based on visibility
-   Automatic pause for videos outside the active view
-   Looping reel experience
-   Food name and description display
-   Food partner store/profile button
-   Responsive video layout
-   Loading state while food data is being fetched

------------------------------------------------------------------------

## ❤️ Like & Save Features

-   Like food videos
-   Unlike food videos
-   Save food videos
-   Unsave food videos
-   Like counters
-   Save counters
-   Saved videos page
-   Saved videos remain associated with the logged-in user
-   Empty Saved state for users who have not saved anything yet

------------------------------------------------------------------------

## 🏪 Food Partner Features

-   Food Partner registration
-   Food Partner login
-   Food Partner profile
-   View own food posts
-   Upload food videos
-   Add food name and description
-   Cloud video upload using ImageKit
-   Delete owned food videos
-   Automatic cleanup of related likes and saves when a food post is
    deleted
-   Food partner statistics including total posts and total likes
-   Public-facing food partner profile for logged-in users

------------------------------------------------------------------------

## 🎬 Reel Experience

-   Vertical scroll feed
-   Scroll snapping
-   Seamless looping between first and last videos
-   Video autoplay using IntersectionObserver
-   Muted inline video playback
-   Like and save actions directly on the reel
-   Food partner navigation from each reel
-   Separate ReelViewer component for food-partner management
-   Previous/next video navigation in the ReelViewer
-   Delete action in the food-partner ReelViewer

------------------------------------------------------------------------

## 🎨 User Experience

-   Reusable Food View logo component
-   Loading screens
-   Error states
-   Demo notice for the user application
-   Demo alert for the food partner management area
-   Dedicated empty state for Saved videos
-   Responsive layout for mobile and desktop screens
-   Bottom navigation for Home and Saved sections
-   Shared authentication styling
-   Dedicated page styles for different application areas

------------------------------------------------------------------------

# 🏗️ System Architecture

``` text
                         +--------------------------+
                         |      React Frontend      |
                         |       Vite + React       |
                         +------------+-------------+
                                      |
                                  Axios API
                                      |
                                      ▼
                         +--------------------------+
                         |      Express Backend     |
                         |   REST APIs + Auth       |
                         +------------+-------------+
                                      |
                   +------------------+------------------+
                   |                                     |
                   ▼                                     ▼
        +----------------------+              +----------------------+
        |       MongoDB        |              |       ImageKit       |
        | Users, Food, Likes,  |              | Food Video Storage   |
        | Saves & Partners     |              |                      |
        +----------------------+              +----------------------+
                   |
                   ▼
        +----------------------+
        | JWT + Cookie Auth    |
        | User / Food Partner  |
        +----------------------+
```

------------------------------------------------------------------------

# 🔄 Application Workflow

``` text
User / Food Partner
          │
          ▼
Choose Account Type
          │
     ┌────┴─────┐
     ▼          ▼
   User     Food Partner
     │          │
     ▼          ▼
 Register/Login  Register/Login
     │          │
     ▼          ▼
 JWT Cookie    JWT Cookie
     │          │
     ▼          ▼
 Food Feed     Food Partner Panel
     │          │
 ┌───┴────┐    ├── View Profile
 ▼        ▼    ├── Upload Video
Like     Save  └── Delete Video
 │        │
 └───┬────┘
     ▼
 Saved Videos
     │
     ▼
 Food Partner Profile
```

------------------------------------------------------------------------

# 📁 Project Structure

``` text
Food-App

├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── services
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   │   ├── auth
│   │   │   ├── create-food
│   │   │   └── generale
│   │   ├── routes
│   │   ├── styles
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

> The repository may contain local development media used while
> building/testing the application. Video/media folders are
> intentionally not documented here because they are not part of the
> application's source architecture.

------------------------------------------------------------------------

# 🛠 Technologies Used

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT
-   bcryptjs
-   cookie-parser
-   multer
-   cors
-   dotenv
-   uuid
-   ImageKit Node SDK

------------------------------------------------------------------------
