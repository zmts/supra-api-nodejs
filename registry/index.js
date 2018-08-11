const CurrentUserRegistry = require('./CurrentUserRegistry')
const QueryParamsRegistry = require('./QueryParamsRegistry')

module.exports = {
  currentUser: new CurrentUserRegistry(),
  queryParams: new QueryParamsRegistry()
}
