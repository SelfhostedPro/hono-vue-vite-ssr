// import 'vite/modulepreload-polyfill'
import { Hono } from "hono"
import { serveStatic } from "@hono/node-server/serve-static"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from 'node:url'
import { dirname, basename } from 'node:path'
import { render } from './src/entry-server'

const isProduction = process.env["NODE_ENV"] === "production"
const __filename = fileURLToPath(import.meta.url);
const root = dirname(__filename);
const base = basename(root)
const port = process.env.PORT || 3000

// Cached production assets
const templateHtml = await readFile(`${root}/index.html`, 'utf-8')

const app = new Hono()
	.use("*", serveStatic({
		root: isProduction ? `${base}/` : "./",
		onNotFound(path, c) {
			console.log('path', `${base}/`)
			console.log('not found path', path)
			console.log('not found request', c.req.url)
		},
	}))
	.use("*", async (_c, next) => {
		await next()
	})
	.get("/*", async c => {
		if (isProduction) console.log(c.req.url)
		return c.html(templateHtml.replace('<!--app-html-->', (await render()).html))
	})


export default {
	fetch: app.fetch,
	port: port
}
