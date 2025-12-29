import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      optimizeDeps: {
        include: ['chart.js', 'react-chartjs-2'],
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              // React core libraries
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'react-vendor';
              }
              // Google AI SDK
              if (id.includes('node_modules/@google/generative-ai')) {
                return 'google-ai';
              }
              // Lucide icons
              if (id.includes('node_modules/lucide-react')) {
                return 'lucide-icons';
              }
              // Feedback components
              if (id.includes('/components/feedback/')) {
                return 'feedback';
              }
              // Chat components
              if (id.includes('/components/chat/') || id.includes('ChatScreen')) {
                return 'chat';
              }
              // Other node_modules
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            }
          }
        },
        chunkSizeWarningLimit: 600, // Raise warning limit to 600KB
      }
    };
});
