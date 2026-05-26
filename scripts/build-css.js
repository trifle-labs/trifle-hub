import postcss from 'postcss'
import tailwindcssNesting from 'tailwindcss/nesting/index.js'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

// Inline @imports manually so postcss sees the full CSS without needing postcss-import
const fontsCSS = readFileSync('src/style/fonts.css', 'utf8')
const resetCSS = readFileSync('src/style/reset.css', 'utf8')
const mainCSS = readFileSync('src/style/index.css', 'utf8')
const inlined = mainCSS
  .replace("@import 'fonts.css';", fontsCSS)
  .replace("@import 'reset.css';", resetCSS)

const wrapInTrifleLayer = {
  postcssPlugin: 'wrap-in-trifle-layer',
  Once(root, { postcss: p }) {
    const fontFaces = []
    root.walkAtRules('font-face', rule => {
      fontFaces.push(rule.clone())
      rule.remove()
    })
    const layer = p.atRule({ name: 'layer', params: 'trifle-hub' })
    ;[...root.nodes].forEach(node => {
      node.remove()
      layer.append(node)
    })
    fontFaces.forEach(ff => root.append(ff))
    root.append(layer)
  }
}

const result = await postcss([
  tailwindcssNesting,
  tailwindcss,
  autoprefixer,
  wrapInTrifleLayer
]).process(inlined, { from: 'src/style/index.css', to: 'dist/trifle-hub.css' })

mkdirSync('dist', { recursive: true })
writeFileSync('dist/trifle-hub.css', result.css)
console.log('Built dist/trifle-hub.css')
