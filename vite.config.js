import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
                            VitePWA({
                                registerType: 'autoUpdate',
                                includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'assets/*.png'],
                                manifest: {
                                    name: 'Daily Lion',
                                    short_name: 'Daily Lion',
                                    description: 'Matando um leão por dia com foco e gamificação.',
                                    theme_color: '#0f172a', // Cor do slate-900 para a barra do sistema
                                    background_color: '#0f172a',
                                    display: 'standalone', // Faz parecer um app nativo, sem barra de URL
                                    icons: [
                                        {
                                            src: 'pwa-192x192.png',
                                    sizes: '192x192',
                                    type: 'image/png'
                                        },
                                    {
                                        src: 'pwa-512x512.png',
                                    sizes: '512x512',
                                    type: 'image/png',
                                    purpose: 'any maskable'
                                    }
                                    ]
                                },
                                workbox: {
                                    // Estratégia: Tenta carregar do cache primeiro para ser instantâneo,
                                    // mas atualiza o cache no fundo se houver internet.
                                    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                                    runtimeCaching: [
                                        {
                                            urlPattern: ({ request }) => request.destination === 'image',
                                    handler: 'CacheFirst',
                                    options: { cacheName: 'images-cache' }
                                        }
                                    ]
                                }
                            })
    ]
});
