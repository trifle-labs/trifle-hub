import tailwindcssNesting from 'tailwindcss/nesting/index.js'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// Wraps all compiled CSS in @layer trifle-hub, keeping @font-face outside the layer.
// This lets consumers (Tailwind v3 or v4) control cascade order without special import syntax.
const wrapInTrifleLayer = (opts = {}) => ({
  postcssPlugin: 'wrap-in-trifle-layer',
  Once(root, { postcss }) {
    const fontFaces = []
    root.walkAtRules('font-face', rule => {
      fontFaces.push(rule.clone())
      rule.remove()
    })
    const layer = postcss.atRule({ name: 'layer', params: 'trifle-hub' })
    ;[...root.nodes].forEach(node => {
      node.remove()
      layer.append(node)
    })
    fontFaces.forEach(ff => root.append(ff))
    root.append(layer)
  }
})
wrapInTrifleLayer.postcss = true

export default {
  plugins: [
    tailwindcssNesting,
    tailwindcss,
    autoprefixer,
    wrapInTrifleLayer
  ]
}
