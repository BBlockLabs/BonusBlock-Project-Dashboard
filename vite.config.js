import { fileURLToPath, URL } from "node:url";

import { createHtmlPlugin } from "vite-plugin-html";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader({
      svgo: false, // svgo causes svgs to break by repeating ids and urls
      defaultImport: "component",
    }),
    createHtmlPlugin({
      minify: true,
      entry:
        process.platform === "linux"
          ? path.resolve("src/main.js")
          : "/src/main.js",
      template: "./public/index.html",
      inject: {
        data: {
          BUILD_DATE: new Date().toISOString(),
          // @ts-ignore
          BUILD_ENV: process.env.NODE_ENV.toUpperCase(),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
