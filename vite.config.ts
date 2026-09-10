import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
// Exportação estática: nenhum Worker, serviço, banco ou API em produção.
export default defineConfig({ css: { postcss: { plugins: [tailwindcss()] } }, plugins: [vinext()] });
