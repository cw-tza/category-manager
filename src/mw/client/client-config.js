const convict = require('convict')

const config = convict({
  env: {
    doc: 'Category Manager',
    format: [
      'production',
      'staging',
      'test',
      'development'
    ],
    default: 'development',
    env: 'NODE_ENV'
  },
  portal: {
    co: {
      doc: 'CubiPortal - Colombia',
      url: {
        doc: 'CubiPortal Host',
        format: 'String',
        default: 'cubi-portal.co',
        env: 'CO_API_URL'
      },
      apiToken: {
        doc: 'API Token',
        format: 'String',
        default: 'sV6vnjLVW7cgwTN83hwjE',
        env: 'CO_API_TOKEN'
      },
      vodServiceId: {
        doc: 'VOD service ID',
        format: 'int',
        default: 2,
        env: 'CO_VOD_SERVICE_ID'
      },
      defaultCoverId: {
        doc: 'Empty cover ID',
        format: 'int',
        default: 1,
        env: 'CO_COVER_ID'
      }
    },
    cr: {
      doc: 'CubiPortal - Costa Rica',
      url: {
        doc: 'CubiPortal Host',
        format: 'String',
        default: 'cubi-portal.cr',
        env: 'CR_API_URL'
      },
      apiToken: {
        doc: 'API Token',
        format: 'String',
        default: 'sV6vnjLVW7cgwTN83hwjE',
        env: 'CR_API_TOKEN'
      },
      vodServiceId: {
        doc: 'VOD service ID',
        format: 'int',
        default: 2,
        env: 'CR_VOD_SERVICE_ID'
      },
      defaultCoverId: {
        doc: 'Empty cover ID',
        format: 'int',
        default: 1,
        env: 'CR_COVER_ID'
      }
    }
  }
})

const env = config.get('env')
config.loadFile('./config/' + env + '.json')
config.validate({allowed: 'strict'})

module.exports = config
