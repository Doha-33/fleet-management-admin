import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy API requests to avoid CORS
  app.use('/api', createProxyMiddleware({
    target: 'https://fletobackend.onrender.com/api',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '', // strip /api from the incoming request because target already has it
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`Response from backend: ${proxyRes.statusCode} for ${req.url}`);
      },
      error: (err, req, res) => {
        console.error('Proxy Error:', err);
      }
    }
  }));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
