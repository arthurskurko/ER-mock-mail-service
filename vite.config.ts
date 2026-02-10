import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: mode === 'test' ? [] : [sveltekit()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  },
  test: { 
    environment: 'node',
    globals: true
  }
}));
