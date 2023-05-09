// ---------- setup file code chính cho client -------------//

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"; // gắn cdn của socketio


const socket = io("ws://localhost:3050");

// socket.on("connection", () => {

// })

// ở đây user vừa join vào một room nào đó => xử lý trả room tương ứng cho người dùng

const id = Math.random().toString(36).substring(4);


// lấy thông tin room và username trên url
const params = new URLSearchParams(location.search);
const room = params.get("room");
const username = params.get("username");

// gửi event join room tới server (kèm userId, room, username)
socket.emit("join-room", id, room, username);


// lắng nghe event từ server trả về khi một user join room => render ra html tương ứng
socket.on("new-member", (username, room, time) => {  // nhận username, room, time từ server trả về
    document.getElementById("message-list").innerHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">Admin</p>
                <p class="message__date">${time}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">
                    Hello ${username} to room ${room}
                </p>
            </div>
        </div>
    `
})

// khi có một user mới join room => danh sách user sẽ được update lại
socket.on("update-room", (users) => {
    if (!users || !users.length) {
        document.getElementById("userList").innerHTML = "";
    }

    const html = users.reduce((result, {username}) => {
        return result + `<li class="app__item-user">${username}</li>`
    }, "");

    document.getElementById("userList").innerHTML = html;
})


// Xử lý send message
document.getElementById("btn-send").addEventListener("click", () => {
    const msg = document.getElementById("input-messages").value;
    socket.emit("send-message", room, id, msg);
})

// nhận event send message từ sever rồi render ra màn hình
socket.on("message-broadcast", (payload) => {
    document.getElementById("message-list").innerHTML += `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">${payload.username}</p>
                <p class="message__date">${payload.time}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">
                    ${payload.message}
                </p>
            </div>
        </div>
    `
})