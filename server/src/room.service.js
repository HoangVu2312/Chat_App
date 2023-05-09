//  đây là file xử lý mảng rooms và users trong từng room

const users = [
    {id: 1, username: "Admin"}
]

const getUsers = (roomId) => {
    return users;
}

const getUserById = (roomId, userId) => {  
    const user = users.find(item => item.id === userId);
    return user;
}

const addUser = (roomId, userId, username) => {
    if (userId === 1) {
        return;
    }

    users.push({id: userId, username})
}


module.exports = {
    getUsers,
    getUserById,
    addUser,

}