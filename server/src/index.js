// ----------- setup socketio tạo server kết nối--------------//

const http = require("http");
const express = require("express");
const {Server} = require("socket.io");
const dayjs = require("dayjs")
const roomService = require("./room.service")

const app = express;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: "*",
})

// lắng nghe client kết nối tới socketio server
io.on("connection", (socket) => {
    console.log("conected", socket.id);  // socket.id đại diện cho client vừa kết nối tới server


    // lắng nghe event một user join vào một room chat
    socket.on("join-room", (userId, room, username) => {

        //TODO here: kiểm tra user có ở trong room đó chưa 
        // nếu chưa => lưu thông tin user db (many-many)
        roomService.addUser(room, userId, username)

        socket.join(room);  // đưa instance của socket (user) vào một room/topic cụ thể
        
        const time = dayjs().format("YYYY-MM-DD HH:mm:ss");  // format lại định dạng date trả về

        io.to(room).emit("new-member", username, room, time); // gửi message (username, room) đến tất cả user trong một room cụ thể

        // gửi event update thông tin room đen một room cụ thể
        io.to(room).emit("update-room", roomService.getUsers(room))
    })

    // lắng nghe event một user send message
    socket.on("send-message", (room, userId, msg) => {
        const user = roomService.getUserById(room, userId);
        const time = dayjs().format("YYYY-MM-DD HH:mm:ss");

        const payload = {
            username: user.username,
            message: msg,
            time
        };

        io.to(room).emit("message-broadcast", payload) // cả room thấy msg của một user
    }) 

})

httpServer.listen(3050)