import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Application Entry Point
 * 
 * This is the main entry point for the React application.
 * It renders the root App component into the DOM element with id "root".
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there's an element with id 'root' in your HTML.");
}

createRoot(rootElement).render(<App />);
