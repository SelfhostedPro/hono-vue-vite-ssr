import { defineConfig } from 'vite'
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import vue from '@vitejs/plugin-vue'
import vueRouter from 'unplugin-vue-router/vite'

// Rollup config imports
import { glob } from "glob"
import { extname, sep } from "node:path"
import { fileURLToPath } from "node:url"

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    target: "ES2022",
    sourcemap: true,
    emptyOutDir: isSsrBuild ? false : true,
    rollupOptions: isSsrBuild ?
      {
        input: Object.fromEntries(
          glob
            .sync(
              [
                "server.ts",
                "src/entry-client.ts",
                "src/pages/**/*.vue",
                "src/api/**/*.ts",
                "src/models/**/*.ts",
                "src/services/**/*.ts",
                "src/utils/**/*.ts",
              ],
              {
                ignore: ["**/*.d.ts", "**/*.test.ts"],
              }
            )
            .map((file) => [
              file.slice(0, file.length - extname(file).length),
              fileURLToPath(new URL(file, import.meta.url)),
            ])
        ),
        output: {
          format: "esm",
          preserveModules: true,
          preserveModulesRoot: ".",
        },
        external: ['vue']
      }
      : undefined
  },
  server: {
    port: 3000
  },
  clearScreen: false,
  plugins: [
    devServer({
      entry: './server.ts',
      exclude: [...defaultOptions.exclude,
        'src/api/index.ts',
        /.*\.vue?($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
      ]
    }),
    // vueRouter({
    //   dts: 'src/typed-router.d.ts',
    // }),
    vue(),
  ],
}))