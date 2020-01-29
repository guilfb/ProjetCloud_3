const moment = require('moment')

function parseDateBeforePush (users) {
  const newUsers = users.map(user => ({
    ...user,
    birthDay: moment.utc(user.birthDay, 'MM/DD/YYYY').format()
  }))
  return newUsers
}

module.exports = parseDateBeforePush
