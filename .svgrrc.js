/**
 * @type {import('@svgr/core').Config}
 */
module.exports = {
  replaceAttrValues: {
    '#8E8E93': "{props.fillPrimary || '#8E8E93'}",
  },
  memo: true,
  svgo: true,
  svgoConfig: {
    plugins: ['removeXMLNS', 'removeDimensions'],
  },
}
