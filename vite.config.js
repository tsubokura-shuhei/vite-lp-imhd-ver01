import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import htmlMinifier from "vite-plugin-html-minifier";
import sassGlobImports from "vite-plugin-sass-glob-import";

import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

const jsFiles = Object.fromEntries(
  globSync("src/assets/**/*.js", {
    ignore: ["node_modules/**", "**/modules/**", "**/dist/**"],
  }).map((file) => [
    path.basename(file, path.extname(file)), // フォルダ構造を除外し、ファイル名のみ取得
    fileURLToPath(new URL(file, import.meta.url)),
  ])
);

const scssFiles = Object.fromEntries(
  globSync("src/assets/scss/**/*.scss", {
    ignore: ["src/assets/scss/**/_*.scss"],
  }).map((file) => [
    path
      .relative("src/assets/scss/", file)
      .replace(/\\/g, "/")
      .replace(/\.[^/.]+$/, ""),
    fileURLToPath(new URL(file, import.meta.url)),
  ])
);

const htmlFiles = Object.fromEntries(
  globSync("src/**/*.html", { ignore: ["node_modules/**", "**/dist/**"] }).map(
    (file) => [
      path
        .relative("src", file)
        .replace(/\\/g, "/")
        .replace(/\.[^/.]+$/, ""),
      fileURLToPath(new URL(file, import.meta.url)),
    ]
  )
);

const inputObject = { ...scssFiles, ...jsFiles, ...htmlFiles };

export default defineConfig({
  root: "./src",
  base: "./",
  build: {
    outDir: "dist",
    cssCodeSplit: true,
    modulePreload: false,
    rollupOptions: {
      input: inputObject,
      output: {
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: (assetInfo) => {
          if (/\.(gif|jpeg|jpg|png|svg|webp)$/.test(assetInfo.name)) {
            return "assets/[name].[ext]";
          }
          if (/\.(css)$/.test(assetInfo.name)) {
            return "assets/css/[name].[ext]";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    sassGlobImports(),
    htmlMinifier({
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeEmptyAttributes: false,
        minifyJS: true,
        ignoreCustomFragments: [
          /<script[^>]*>.*?<\/script>/gs,
          /<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/g,
        ],
      },
    }),
    ViteEjsPlugin(),
  ],
});
