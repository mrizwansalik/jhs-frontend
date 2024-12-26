import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react'

import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

import path from "path";

export default defineConfig({
    base: '/',
    plugins: [
        react(),
        ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })

    ],
    optimizeDeps: {
        esbuildOptions: {
            plugins: [esbuildCommonjs(['react-moment'])],
        },
    },
    resolve: {
        alias: [
            { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
            { find: 'layouts', replacement: path.resolve(__dirname, 'src/layouts') },
            { find: 'store', replacement: path.resolve(__dirname, 'src/store') },
            { find: 'helpers', replacement: path.resolve(__dirname, 'src/helpers') },
            { find: 'config', replacement: path.resolve(__dirname, 'src/config') },
            { find: 'ckPlugins', replacement: path.resolve(__dirname, 'src/ckPlugins') },
            { find: 'pages', replacement: path.resolve(__dirname, 'src/pages') }
        ]
    },
    build: {
        outDir: './build',
        emptyOutDir: true, // also necessary
        sourcemap: true,
    },

})