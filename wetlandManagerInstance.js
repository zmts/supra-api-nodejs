const Wetland = require('wetland').Wetland
const config = require('./wetland')

module.exports = new Wetland(config).getManager()
