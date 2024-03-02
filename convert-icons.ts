/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const { importDirectory, cleanupSVG, runSVGO, parseColors, isEmptyColor } = require('@iconify/tools')
const { promises: fs } = require('fs')
const { dirname } = require('path')
;(async () => {
  const iconSet = await importDirectory('./figma/svg', { prefix: 'figma' })
  const target = './figma/json/icons.json'

  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon') {
      return
    }

    const svg = iconSet.toSVG(name)
    if (!svg) {
      iconSet.remove(name)
      return
    }

    try {
      await cleanupSVG(svg)
      await parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : 'currentColor'
          // if (attr === 'fill') return colorStr == 'none' ? 'red' : colorStr
        },
      })

      await runSVGO(svg, {
        plugins: ['convertStyleToAttrs', 'inlineStyles'],
        multipass: true,
      })
    } catch (err) {
      console.error(`Error parsing ${name}:`, err)
      iconSet.remove(name)
      return
    }

    iconSet.fromSVG(name, svg)
  })

  const output = JSON.stringify(iconSet.export(), null, '\t')
  const dir = dirname(target)
  try {
    await fs.mkdir(dir, {
      recursive: true,
    })
  } catch (err) {
    //
  }

  await fs.writeFile(target, output, 'utf8')
})()
