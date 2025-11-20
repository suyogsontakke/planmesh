<div align="center">
  <img src="https://i.postimg.cc/0jtZ99yG/Plan-Mesh-Logo.png" alt="PlanMesh Logo" width="200" />
  <!-- <h1 style="font-size: 3rem; margin-top: 0;">
    Plan<span style="color: #bef264;">Mesh</span>.
  </h1> -->
  
  <h3>Curate Your Reality. No Basic Trips.</h3>
  
  <p>
    The ultimate Gen Z travel planner. Create aesthetic, personalized itineraries with AI intelligence, 
    3D globe visualizations, and hyper-local insights.
  </p>
  
  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Status-Active-bef264?style=flat-square&labelColor=black" alt="Status"/>
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/AI-Gemini_2.5-8E75B2?style=flat-square&logo=google&logoColor=white" alt="Gemini"/>
  </p>
  
  <strong>Live Demo: <a href="https://planmesh.vercel.app/">Here!!</a></strong>
</div>

<!-- Add a screenshot of your app here -->
![PlanMesh Dashboard Screenshot](https://i.postimg.cc/jq159Gx0/image.png)

---

## 📖 Table of Contents

<details><summary>Expand Table of Contents</summary>

* [🚀 About This Project](#-about-this-project)
* [✨ Key Features](#-key-features)
* [🛠️ Technologies Used](#️-technologies-used)
* [🔗 System Architecture](#-system-architecture)
* [🧰 Getting Started](#-getting-started)
  * [📋 Prerequisites](#-prerequisites)
  * [⚙️ Installation & Setup](#️-installation--setup)
  * [▶️ Run Locally](#️-run-locally)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)
* [💎 Acknowledgements](#-acknowledgements)

</details>

---

## 🚀 About This Project

**PlanMesh** is a futuristic, client-side Single Page Application (SPA) designed to revolutionize how the next generation plans travel. Moving away from boring spreadsheets and static lists, PlanMesh uses **Google's Gemini AI** to generate hyper-personalized itineraries based on "vibe," budget, and travel style.

The application features a stunning **3D interactive globe** that visualizes your journey, tracks flight paths, and even simulates city skylines using procedural generation. With a design language rooted in "Neo-Brutalism" and "Glassmorphism," it offers an immersive experience for the modern traveler.

---

## ✨ Key Features

*   **🤖 AI-Powered Itineraries:** Uses `gemini-2.5-flash` to generate comprehensive day-by-day plans, including estimated costs in dual currencies, transport logic, and booking advice.
*   **🌍 Interactive 3D Globe:** Built with `react-globe.gl`, featuring flight path arcs, satellite views, and procedural 3D buildings that rise as you explore.
*   **🎨 Gen Z Aesthetic:** A dark-mode-first UI with neon accents, noise textures, and glassmorphism effects using Tailwind CSS.
*   **🎭 Travel Personas:** Customize plans based on styles like "Relaxed," "Adventure," "Cultural," or "Boujee."
*   **🖼️ AI Avatar Studio:** Uses `gemini-2.5-flash-image` (Nano Banana) to generate custom stylized profile pictures based on text prompts.
*   **🔐 Auth & History:** A mock-backend system using `localStorage` to handle User Signup/Login, Profile Management, and Trip History persistence.
*   **📍 Smart Routing:** Dynamic integration with Google Maps for navigation and hotel/transport searching.
*   **💡 Secret Tips & Quotes:** Daily humorous quotes in Hinglish and encrypted "Hidden Gem" tips for every destination.
*   **🔒 Security:** Password handling and mock-session management included.

---

## 🛠️ Technologies Used

<details><summary>This project utilizes the following technologies:</summary>

*   [**React 19**](https://react.dev/): Core UI library (via ESM imports).
*   [**TypeScript**](https://www.typescriptlang.org/): For type safety and robust data structures.
*   [**Google GenAI SDK**](https://www.npmjs.com/package/@google/genai): Powers the itinerary generation and image creation.
*   [**React Globe GL**](https://github.com/vasturiano/react-globe.gl): For the 3D Earth visualization and animations.
*   [**Tailwind CSS**](https://tailwindcss.com/): Utility-first CSS framework for styling and animations.
*   [**Lucide React**](https://lucide.dev/): Beautiful, consistent iconography.
*   [**Framer Motion**](https://www.framer.com/motion/): For smooth UI transitions and card animations.

</details>

[![Technologies Used](https://skillicons.dev/icons?i=react,ts,tailwind,threejs,googlecloud,html,css)](https://skillicons.dev)

---

## 🔗 System Architecture

PlanMesh operates as a **Client-Side-Only** application to ensure speed and privacy during the prototype phase.

1.  **Frontend:** React components render the UI.
2.  **Data Layer:** `userService.ts` acts as a pseudo-database, reading and writing JSON data to the browser's `localStorage`.
3.  **AI Layer:** The app communicates directly with Google's Gemini API to fetch dynamic JSON data for trips and Base64 strings for images.

---

## 🧰 Getting Started

### 📋 Prerequisites

*   **Node.js** (v16 or higher) installed on your machine.
*   A **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudiocdn.google.com/)).

### ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/suyogsontakke/planmesh.git
    cd planmesh
    ```

2.  **Environment Configuration**
    *   Create a file named `.env` in the root directory (if using a bundler) or locate `services/geminiService.ts`.
    *   Add your API key:
        ```env
        GEMINI_API_KEY=your_actual_google_gemini_api_key_here
        ```

### ▶️ Run Locally

Since this project uses ES Modules via CDN in `index.html`, you can run it using a simple HTTP server.

**Option A: Using npx (Recommended)**
```bash
npx live-server
# OR
npx serve
```

**Option B: VS Code Live Server**
*   Open the project in VS Code.
*   Right-click `index.html`.
*   Select "Open with Live Server".

The app will launch at `http://127.0.0.1:8080` (or similar port).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 💎 Acknowledgements

*   **Google Gemini Team** for the powerful AI models.
*   **Vasturiano** for the incredible `react-globe.gl` library.
*   **Tailwind Labs** for the styling engine.
*   **Lucide** for the crisp icons.
