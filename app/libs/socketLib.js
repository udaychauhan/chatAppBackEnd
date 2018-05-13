const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const tokenLib = require('./tokenLib');
const check = require('./checkLib');
const response = require('./responseLib');

const events = require('events');
const eventEmitter = new events.EventEmitter();
const ChatRoomModel = mongoose.model('ChatRoom');
const ChatModel = mongoose.model('Chat');


let setServer = (server) => {
    let allOnlineUsers = [];

    let io = socketio.listen(server);

    let myIo = io.of('');

    // whenever we want to do cross soccket communication we use io (or myIo) 
    // because socket is our pipe and from our pipe (i.e socket) we emit it on 
    // myIo that can be assumed to be collection of pipe 

    // an observation these sockets are pipe from client to server


    myIo.on('connection', (socket) => {
        console.log('on connection -- emitting verify user');
        // this socket will emit this event and whoever 
        // connects wiht this socket will get this event
        let onConnectionData = {
            message: 'Socket Connected',
        }
        socket.emit('verifyUser', onConnectionData);
        // this event was emitted from the client side
        // now it is upto socket what to do
        //socket room id and name will be send by user along with authToken
        socket.on('setUser', (data) => {
            console.log('setUser called' + data);
            let authToken = data.authToken;
            let chatRoomId = data.chatRoomId;
           
            tokenLib.verifyClaimWithoutSecret(data.authToken, (err, user) => {
                if (err) {
                    socket.emit("errorEvent", "Auth Error! PLease Login Again!");
                    socket.disconnect(true);
                } else {
                    console.log('user is verified -setting details');
                    let currentUser = user.data;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                    console.log('full name is ' + fullName);
                    //setting socket user id
                    //now this is where the socket gets identity
                    // if socket already has userId then no need to set it
                    //---- find fix for multiple user adding to online user list
                    socket.userId = currentUser.userId;
                    socket.name = fullName;
                    let userObj = { userId: currentUser.userId, fullName: fullName };
                    allOnlineUsers.push(userObj);
                    console.log(allOnlineUsers);
                    //-- as this will be execued for every user therefore all user will join same room
                    // setting room name
                    socket.room = chatRoomId;
                    //joining chat room
                    socket.join(socket.room);
                    console.log('joined chat room ' + socket.room);
                    let obj = {
                        message: 'join',
                        sendBy: fullName,
                        list: allOnlineUsers
                    }
                    socket.to(socket.room).broadcast.emit('onlineUserList', obj);
                }
            });
        });

        socket.on('chatMsg', (data) => {
            console.log("socket chat message on server is called");
            console.log(data);
            data.chatRoomId = socket.room;
            setTimeout(() => {
                eventEmitter.emit('saveChatToChatRoom', data);
            }, 2000);
            console.log("message send by " + data.senderName + "to " + socket.room);
            socket.to(socket.room).broadcast.emit('chatMsg', data);
        });


        socket.on('userTyping', (data) => {
            socket.to(socket.room).broadcast.emit('userTyping', data);
        });

        socket.on('disconnect', () => {
            //disconnecct the user from the socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log('user is disconnected');
            console.log(socket.userId);

            var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex, 1);
            console.log(allOnlineUsers);

            let obj = {
                message: 'left',
                sendBy: socket.name,
                list: allOnlineUsers
            }
            socket.to(socket.room).broadcast.emit('onlineUserList', obj);
            socket.leave(socket.room)
        });

        socket.on('allChatRoomMsg', (data) => {


            let findQuery = {
                chatRoom: socket.room
            }

            let messages;
            console.log('chatRoomMsg called now in server');

            ChatModel.find(findQuery)
                .select('-_id -__v -receiverName -receiverId -modifiedOn -createdOn ')
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'socket: getUsersChat', 10)
                        socket.emit("errorEvent",err.message);
                    } else if (check.isEmpty(result)) {
                        logger.info('No Chat Found', 'socket: getUsersChat')
                        socket.emit("errorEvent","No Chat Found")
                    } else {
                        console.log('chat found and listed.')
                        // reversing array.
                        let reverseResult = result;//.reverse();
                        messages = reverseResult;
                        socket.emit('myMsg', messages);
                    }
                });
        });

    });
}

// to save chat msg to chat room db
// saving chats to database.
eventEmitter.on('saveChatToChatRoom', (data) => {
    // data == room id, sender name , sender id, message

    let chatRoomId = data.chatRoomId;
    console.log('save chat msg to db called' + chatRoomId);
    if (check.isEmpty(chatRoomId)) {
        throw err;
    }

    let newChat = new ChatModel({
        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        message: data.message,
        chatRoom: chatRoomId,
        createdOn: data.createdOn
    });

    newChat.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved  to " + chatRoomId);
            console.log(result);
        }

    }); // end of saving chat.

});




module.exports = {
    setServer: setServer
}

// observations
// socket.emit('error',"message");
//here the emit error event is something taht is inbuilt event and needs to be handled
// so create your own event so that server does not crash