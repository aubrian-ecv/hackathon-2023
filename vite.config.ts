import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: 'src/background.ts', // Le chemin vers votre script d'arrière-plan
        content_script: 'src/content.ts', // Le chemin vers votre script de contenu
        popup: 'src/popup.ts',
        test: 'src/test.ts'
        // Ajoutez d'autres points d'entrée si nécessaire
      },
      output: {
        dir: 'dist', // Le dossier où les fichiers compilés seront placés
        format: 'esm', // Format du module ES, qui est généralement préférable pour les modules modernes
        chunkFileNames: 'scripts/[name]-[hash].js',
        entryFileNames: 'scripts/[name].js',
      }
    }
  }
});
