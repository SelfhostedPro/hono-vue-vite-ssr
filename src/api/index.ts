import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'


const app = new Elysia({ name: 'index' })
    .onRequest((c) => {
        console.log(c.request.url)
    })
    .use(swagger({ provider: 'swagger-ui' }))
    .onError((c) => {
        console.log('error from elysia', c.error)
    })
    .get('/', () => {
        console.log('Hi from /api')
        return 'hi'
    })


app.routes.map(({ path, method }) => {
    console.log(`registering api handler ${method} | ${path}`)

})

export default app