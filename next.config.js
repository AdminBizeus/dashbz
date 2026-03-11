const path = require('path')
const withTM = require('next-transpile-modules')(['utils'])

module.exports = withTM({
  compiler: {
    styledComponents: true
  },
  webpack: (config) => {
    config.resolve.alias['redux-path'] = path.resolve(__dirname, 'src/redux')
    config.resolve.alias['views-path'] = path.resolve(__dirname, 'src/views')
    config.resolve.alias['components-path'] = path.resolve(__dirname, 'src/components')
    config.resolve.alias['containers-path'] = path.resolve(__dirname, 'src/containers')
    config.resolve.alias['layouts-path'] = path.resolve(__dirname, 'src/layouts')
    config.resolve.alias['hooks-path'] = path.resolve(__dirname, 'src/hooks')
    return config
  }
})
