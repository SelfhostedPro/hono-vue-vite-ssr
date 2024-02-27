import {
    createRouter as _createRouter,
    createMemoryHistory,
    createWebHistory,
} from 'vue-router'

// Auto generates routes from vue files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.vue')

export function createRouter() {

    const routes = Object.keys(pages).map((path) => {
        const match = path.match(/\.\/pages(.*)\.vue$/);
        if (!match) {
            throw new Error(`Path ${path} does not match the expected pattern.`);
        }
        const name = match[1].toLowerCase();
        return {
            path: name === '/index' ? '/' : name,
            component: pages[path], // () => import('./pages/*.vue')
        }
    })

    console.log(routes)
    
    return _createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes
    })
}