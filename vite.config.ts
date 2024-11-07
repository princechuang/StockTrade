import { defineConfig, loadEnv, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import * as path from "path";
import pptv from "postcss-px-to-viewport-8-plugin";
import { createHtmlPlugin } from "vite-plugin-html";
import viteCompression from "vite-plugin-compression";
//import viteImagemin from "vite-plugin-imagemin";

//const path=require('path');
const getViteEnv = (mode:any, target:any) => {
  return loadEnv(mode, process.cwd())[target];
};
// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) =>
  defineConfig({
    
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: getViteEnv(mode, "VITE_APP_TITLE"),
          },
        },
      }),
      viteCompression(),
      //viteImagemin(),
    ],
    css: {
      postcss: {
        plugins: [
          pptv({
            viewportWidth: 375,
            //, "!font-size"
            propList: ["*"],
          }),
        ],
      },
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve("src"),
        },
      ],
    },
    
    server: {
      proxy: {
        "/hpapi": {
          target: "https://alextian.tpddns.cn:4431",
          secure: false,
          changeOrigin: true,
          //rewrite:(path)=>path.replace(/^\/hpapi/,'')
        },
      },
    },
    define: {
      "process.env": {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  });
