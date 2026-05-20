# Vertex E-Commerce Frontend 🛍️

**Live Demo:** [Vertex Alpha](https://vertex-frontend-alpha.vercel.app/)

Vertex is an immersive, modern e-commerce storefront that blends a pixel-perfect user interface with high-fidelity 3D product visualizations to create an engaging user experience. 

## ✨ Key Features
- **3D Product Visualization:** Built with Three.js and React Three Fiber to allow users to interact with products in 3D space.
- **Responsive & Animated UI:** Beautiful micro-interactions powered by Framer Motion and styled with Tailwind CSS.
- **Advanced State Management:** Robust cart and user session handling utilizing Redux Toolkit.
- **Admin Dashboard Integration:** Seamlessly connects with the backend to render dynamic Recharts data for administrative users.

## 🛠️ Technical Stack
- **Framework:** React 18, TypeScript, Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS, Framer Motion
- **3D Rendering:** Three.js, @react-three/fiber, @react-three/drei
- **Data Visualization:** Recharts
- **HTTP Client:** Axios

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have Node.js installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AffanAhmed7/Vertex-frontend.git
   ```
2. Navigate to the directory:
   ```bash
   cd Vertex-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables (create a `.env` file):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts
- `npm run dev` - Starts the Vite development server
- `npm run build` - Builds the app for production
- `npm run preview` - Locally preview the production build
- `npm run lint` - Run ESLint

---
*Built as part of the Vertex Full-Stack E-Commerce Platform.*
