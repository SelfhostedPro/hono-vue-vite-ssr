import { defineConfig } from 'vite'
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import vue from '@vitejs/plugin-vue'

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
                "api/**/*.ts",
                "models/**/*.ts",
                "services/**/*.ts",
                "utils/**/*.ts",
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
        /.*\.vue?($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
      ]
    }),
    vue(),
  ],
}))