import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss-modules";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import replace from "rollup-plugin-replace";

import postcssPresetEnv from "postcss-preset-env";

const env = {
  NODE_ENV: process.env.NODE_ENV || "production"
};

export default {
  input: "src/js2/index.tsx",
  output: {
    file: "dist/frontend/bundle.js",
    format: "iife"
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.API_URL": JSON.stringify(
        env.API_URL || "http://localhost:3000"
      )
    }),
    postcss({
      modules: {
        camelCase: true
      },
      //@ts-ignore https://github.com/egoist/rollup-plugin-postcss#extract-css
      extract: true,
      plugins: [
        postcssPresetEnv({
          stage: false,
          features: {
            "nesting-rules": true
          }
        })
      ],
      writeDefinitions: true
    }),
    typescript()
  ].concat(env.NODE_ENV === "production" ? [terser()] : [])
};
