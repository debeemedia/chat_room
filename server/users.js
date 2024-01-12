const users = []

function getUsers () {
    return users
}

function addUser ({id, name, room}) {
    // name = name.trim().toLowerCase()
    // room = room.trim().toLowerCase()

    const existingUser = users.find(user => user.name == name && user.room == room)
    if (existingUser) {
        return {error: 'User already exists in the room'}
    }
    const user = {id, name, room}
    users.push(user)
    return {user}
}

function removeUser (id) {
    const userId = users.findIndex(user => user.id == id)
    if (userId == -1) {
        return {error: 'User is not in the room'}
    }
    return users.splice(userId, 1)[0]
}

function getUser (id) {
    const user = users.find(user => user.id == id)
    if (!user) {
        return {error: 'User is not in the room'}
    }
    return {user}
}

function getUsersInRoom (room) {
    const usersInRoom = users.filter(user => user.room == room)
    return usersInRoom
}

module.exports = {
    getUsers,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}