const moment = require('moment')

function parseDateBeforeGet (users) {
  const newUsers = users.map(user => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    position: user.position,
    birthDay: moment(user.birthDay, 'MM/DD/YYYY').format('L')
  }))

  return newUsers
}

module.exports = parseDateBeforeGet
