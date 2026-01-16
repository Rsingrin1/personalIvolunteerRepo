import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ChakraProvider } from '@chakra-ui/react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // force localhost instead of 127.0.0.1
    port: 5173,        // make sure it stays on 5173
    open: true,        // optional: auto-open browser
  },
});