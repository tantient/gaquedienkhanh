import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (
  typeof window !== "undefined" &&
  window.location.hostname === "gaquedienkhanh.replit.app"
) {
  window.location.replace(
    "https://gaquedienkhanh.com" +
      window.location.pathname +
      window.location.search +
      window.location.hash
  );
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
