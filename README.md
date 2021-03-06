# Half-Stack Developer Website Source

This repository contains the source files for the website [half-stack.dev](https://half-stack.dev/).

Currently nothing more than a static blog generator:

- Use [marked](https://marked.js.org/) to compile markdown files
- Use [Lit](https://lit.dev/) to build web components
- Use [esbuild](https://esbuild.github.io/) as transpiler and bundler
- Minimal templating with [template-html](https://github.com/grit96/template-html)
- Use [Workbox](https://developers.google.com/web/tools/workbox) for service worker caching
- And the good old gulp to build the whole thing

This will be my blog mainly for web development topics written in English.

## Daily Usage

### Creating Posts

Posts are content sorted by date, think of blog posts.

Say you want to write a post named "Foo Bar":

1. Create a folder `foo-bar` under `content/posts`
2. Folder name should be lower case with minus sign, it will be part of the URL. E.g. `content/posts/foo-bar`. The URL would then be `example.dev/posts/foo-bar`
3. Under that folder, create a markdown file, its name **MUST** be `YYYY-MM-DD_index.md`, where *YYYY-MM-DD* is the date you'd like the post to be shown as published. E.g. `2021-07-30_index.md`. This date is important for display order on homepage
4. All related assets, like images, downloadable files etc., should also be put into the folder

### Creating Pages

Pages are just pages, think of "about", "contact" sections of a website.

For an "About" page:

1. Create a folder `about` under `content/pages`
2. Folder naming is the same as for posts, e.g. `content/pages/about`. The URL would then be `example.dev/pages/about`
3. Under that folder, create a markdonw file, its name **MUST** be `index.md`

### Build

Run `npm build`.

### Serve

The build output files are stored in the `public` folder, set this folder for yout static site hosting service.

## Advanced Customization

### Change Templates

TODO
