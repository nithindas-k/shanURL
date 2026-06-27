import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import http from 'http';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'proxy-redirects',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/r/')) {
            const proxyReq = http.request(
              {
                host: 'localhost',
                port: 3000,
                path: req.url,
                method: req.method,
                headers: req.headers,
              },
              (proxyRes) => {
                res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
                proxyRes.pipe(res);
              }
            );
            req.pipe(proxyReq);
            return;
          }
          next();
        });
      },
    },
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
