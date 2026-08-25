import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/virtual_meeting_UI/",
  plugins: [react()],
});
