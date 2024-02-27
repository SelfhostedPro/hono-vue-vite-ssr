# Hono + Vue 3 + TypeScript + Vite + SSR

This template is a simple working configuration for using Hono combined with Vue 3 and Vite to develop and serve an application using SSR. It's based off of the [Vue 3 + TypeScript + Vite Starter Template](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue-ts).

Most of the documentation around this tooling is fairly poor so it took quite a bit of time and research to sort out how to do this and a lot of trial and error but I'm fairly happy with how it turned out.

## Usage

So far this has only been tested with bun but it should work with most package management tools.

### Installation

Clone the repo locally and then run the following command.

```bash
bun i
```

### Development

Once everything has been installed you can run the following command to start up your server and see your changes as you work. By default it will be available on port `3000`.

```bash
bun run dev
```

### Building

To build for production run

```bash
bun run build
```

Then, you can test it out locally

```bash
bun run preview
```

## How it works

To make things a bit more understandable I wanted to provide some details on how the underlying packages are configured to get this working

### Devserver

Hono has it's own package in order to enable using hono for the devserver with some good documentation but when it comes to running locally instead of on cloudflare, things start to feel a bit sparse.

The most important parts here are `server.ts`, `index.ts`, and `src/entry-server.ts`.

`server.ts` will read `index.html` to a string and store it in memory, then whenever a request comes to an endpoint the following will happen:

- the `serveStatic` middleware will check to see if there's any files that match that name in the current directory