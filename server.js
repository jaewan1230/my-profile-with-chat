const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 정적 파일 경로 설정
app.use(express.static(__dirname + '/public'));

// 접속한 유저 관리
const users = new Set();

// 소켓 연결 처리
io.on('connection', (socket) => {
    let username;

    // 유저 입장
    socket.on('join', (user) => {
        username = user;
        users.add(username);
        io.emit('userJoined', username);
    });

    // 메시지 전송
    socket.on('message', (data) => {
        io.emit('message', {
            user: username,
            text: data.text
        });
    });

    // 연결 종료
    socket.on('disconnect', () => {
        if (username) {
            users.delete(username);
            io.emit('userLeft', username);
        }
    });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 