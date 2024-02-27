// import 'vite/modulepreload-polyfill'
import { Hono } from "hono"
import { serveStatic } from "@hono/node-server/serve-static"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from 'node:url'
import { dirname, basename, extname } from 'node:path'
import { render } from './src/entry-server'
import { getRouterName, showRoutes } from 'hono/dev'
import fwAPI from './src/api'

const isProduction = process.env["NODE_ENV"] === "production"
const __filename = fileURLToPath(import.meta.url);
const root = dirname(__filename);
const base = basename(root)
const port = process.env.PORT || 3000

// Cached production assets
const templateHtml = await readFile(`${root}/index.html`, 'utf-8')
const reservedUrls = [
	'main.ts',
	'/api'
]

const server = new Hono()
	.use("*", async (_c, next) => {
		await next()
	})
	.use("/*", async (c, next) => {
		const reserved = reservedUrls.map((url) => c.req.url.includes(url))
		if (reserved.includes(true)) {
			return next()
		} else {
			console.log(`continuing on ${c.req.url}`)
			return c.html(templateHtml.replace('<!--app-html-->', (await render()).html))
		}
	})
	.use("/*", serveStatic({
		root: isProduction ? `${base}/` : "./",
		rewriteRequestPath(path) {
			console.log('from serveStatic middleware')
			console.log(path)
			return path
		},
	}))

const app = new Hono()
	.mount('/api', (c) => {
		return fwAPI.fetch(c)
	})
	.mount('/', server.fetch)





console.log(`Listening on ${port}...`)
console.log(getRouterName(app))
console.log(showRoutes(app))

export default {
	fetch: app.fetch,
	port: port
}
