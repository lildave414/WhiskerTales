import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom fonts from Google Fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Add a favicon
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📖</text></svg>";
document.head.appendChild(favicon);

// Set page title
document.title = "Bedtime Story Generator";

// Update meta description
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Generate whimsical bedtime stories featuring your child's favorite animals";
document.head.appendChild(metaDescription);

// Create root element if it doesn't exist
let rootElement = document.getElementById("root");
if (!rootElement) {
  rootElement = document.createElement("div");
  rootElement.id = "root";
  document.body.appendChild(rootElement);
}

// Initialize React app
createRoot(rootElement).render(<App />);
