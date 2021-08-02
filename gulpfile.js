const {src, dest, series, parallel}  = require('gulp');
const del = require('del');
const less = require('gulp-less');
const markdown = require('gulp-markdown');
const template = require('gulp-template-html');
const through2 = require('through2');
const Vinyl = require('vinyl');
const esbuild = require('esbuild');
const glob = require('glob');
const rename = require('gulp-rename');

const sourceRoot = 'src';
const targetRoot = 'public';
const contentRoot = 'content';

/**
 * Clean the output (public) directory
 * @returns {Promise<string[]>}
 */
const clean = function() {
  return del([`${targetRoot}/*`], {dot: true});
};

/**
 * Copy things directly to output directory
 * @returns {NodeJS.ReadWriteStream}
 */
const copy = function() {
  return src([`${sourceRoot}/assets/*`])
    .pipe(dest(`${targetRoot}/assets/`));
};

/**
 * Build (copy) the index (home) page
 * @returns {NodeJS.ReadWriteStream}
 */
const buildIndexPage = function() {
  return src([`${sourceRoot}/tmpl/index.html`])
    .pipe(dest(`${targetRoot}/`));
};

/**
 * Compile LESS file(s)
 * @returns {NodeJS.ReadWriteStream}
 */
const buildCss = function() {
  return src([`${sourceRoot}/css/index.less`])
    .pipe(less())
    .pipe(dest(`${targetRoot}/assets/`));
};

// Extract page title from <h1>
const getTitle_ = content => {
  if (content.length > 0) {
    const firstLine = content.split('\n')[0];
    return firstLine.replace('<h1>', '').replace('</h1>', '');
  } else {
    return 'Untitled';
  }
}

// Wrap the content with template-html placeholders
const wrap_ = fill => {
  const top = `<!-- build:title -->${getTitle_(fill)}<!-- /build:title --><!-- build:content -->`;
  const bottom = '<!-- /build:content -->';
  return top + fill + bottom;
};

/**
 * Build posts from Markdown files
 * @returns {NodeJS.ReadWriteStream}
 */
const buildPosts = function() {
  return src(`${contentRoot}/posts/**/*.md`)
    .pipe(markdown({
      headerIds: false,
      xhtml: true
    }))
    .pipe(through2.obj((file, enc, cb) => {
      if (file.isBuffer()) {
        const wrapped = wrap_(file.contents.toString());
        file.contents = Buffer.from(wrapped);
      }
      cb(null, file);
    }))
    .pipe(template(`${sourceRoot}/tmpl/post.html`))
    .pipe(rename(path => {path.basename = 'index'}))
    .pipe(dest(`${targetRoot}/posts/`));
};

/**
 * Build pages from Markdown files
 * @returns {NodeJS.ReadWriteStream}
 */
 const buildPages = function() {
  return src(`${contentRoot}/pages/**/*.md`)
    .pipe(markdown({
      headerIds: false,
      xhtml: true
    }))
    .pipe(through2.obj((file, enc, cb) => {
      if (file.isBuffer()) {
        const wrapped = wrap_(file.contents.toString());
        file.contents = Buffer.from(wrapped);
      }
      cb(null, file);
    }))
    .pipe(template(`${sourceRoot}/tmpl/page.html`))
    .pipe(dest(`${targetRoot}/pages/`));
};

/**
 * Build a JSON file for listing all posts
 * @returns {NodeJS.ReadWriteStream}
 */
const buildArchive = function() {
  const archive = [];

  // extract title from first line of md file
  const getTitle_ = content => {
    if (content.length > 0) {
      const lineOne = content.split('\n')[0];
      return lineOne.replace('# ', '');
    } else {
      return '';
    }
  };

  return src(`${contentRoot}/posts/**/*.md`)
    .pipe(through2.obj((file, enc, cb) => {
      if (file.isBuffer()) {
        // extract file info as a JSON object
        const f = {
          title: getTitle_(file.contents.toString()),
          path: file.path.replace(`${file.cwd}/${contentRoot}`, '').replace(file.basename, ''),
          created: new Date(file.basename.split('_')[0])
        };
        archive.push(f); // collect JSON
      }
      cb();
    }, cb => {
      const file = new Vinyl({
        path: 'archive.json',
        contents: Buffer.from(JSON.stringify(archive, null, 2))
      });
      cb(null, file);
    }))
    .pipe(dest(`${targetRoot}/assets/`));
};

/**
 * Uses esbuild to bundle lit components
 * @returns {Promise}
 */
const buildLit = function() {
  return esbuild.build({
    entryPoints: glob.sync(`${sourceRoot}/js/wc/**/*.ts`),
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: `${targetRoot}/assets/wc`
  });
};

const buildMd = parallel(buildPosts, buildPages, buildArchive);

exports.clean = clean;
exports.styles = buildCss;
exports.lit = buildLit;
exports.index = buildIndexPage;
exports.markdowns = buildMd;
exports.default = series(clean, parallel(copy, buildCss, buildIndexPage, buildMd, buildLit));
