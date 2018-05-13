const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')

const ChatRoomModel = mongoose.model('ChatRoom');
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');


/**
 * function to retrieve chat of the group.
 * params: chatRoom, skip.
 */
let getChatRoomMessages = (req, res) => {
    // function to validate params.
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.chatRoomId)) {
                logger.info('parameters missing', 'getChatRoomMessages handler', 9)
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        })
    } // end of the validateParams function.

    // function to get chats.
    let findChats = () => {
        return new Promise((resolve, reject) => {
            // creating find query.
            let findQuery = {
                chatRoomId: req.body.chatRoomId
            }

            ChatRoomModel.find(findQuery)
                .select('-_id -__v')
                .sort('-createdOn')
                .skip(parseInt(req.body.skip) || 0)
                .lean()
                .limit(10)
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Chat Room Controller: getChatRoomMessages', 10)
                        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No Chat Found', 'Chat Controller: getChatRoomMessages')
                        let apiResponse = response.generate(true, 'No Chat Found', 404, null)
                        reject(apiResponse)
                    } else {
                        console.log('chat found and listed.')

                        // reversing array.
                        let reverseResult = result.reverse()

                        resolve(result)
                    }
                })
        })
    } // end of the findChats function.

    // making promise call.
    validateParams()
        .then(findChats)
        .then((result) => {
            let apiResponse = response.generate(false, 'All Group Chats Listed', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            res.send(error)
        })
} // end of the getGroupChat function.

let createChatRoom = (req, res) => {
    // first check if chat room with that name exists or not
    let originName = "chatRoomController : createChatRoom";
    let createRoom = () => {
        return new Promise((resolve, reject) => {
            ChatRoomModel.findOne({ chatRoomName: req.body.chatRoomName })
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, originName, 10)
                        let apiResponse = response.generate(true, 'Failed To Create Chat room', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {// if the result is empty that means
                        // chat room does not exists
                        console.log(req.body)
                        let chatroomname = req.body.chatRoomName;
                        let creatorName = req.body.creatorName;
                        let creatorId = req.body.creatorId;

                        let newChatRoom = new ChatRoomModel({
                            chatRoomId: shortid.generate(),
                            chatRoomName: chatroomname,
                            creatorName: creatorName,
                            creatorId: creatorId,
                            message: [],
                            createdOn: time.now(),
                            modifiedOn: time.now()// will be useful when chat room edited

                        });
                        newChatRoom.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, originName, 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                //coverts to javascript object??
                                let newChatRoomObj = newChatRoom.toObject();
                                resolve(newChatRoomObj)
                            }
                        })
                    } else {
                        logger.error('Chat Room Cannot Be Created. Already Present', originName, 4)
                        let apiResponse = response.generate(true, 'Room Already Present With this Name', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }

    createRoom(req,res)
    .then((resolve) => {
        delete resolve.password
        let apiResponse = response.generate(false, 'Chat Room Created created', 200, resolve)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
}

let getChatRooms = (req, res) => {
    // its quite simple 
    // get all data and send it
    let originName = "chatRoomController : getChatRoom";
    ChatRoomModel.find()
    .select(' -__v -_id')
    .lean()
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, originName, 10)
            let apiResponse = response.generate(true, 'Failed To Find room Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Chat Room Found', originName)
            let apiResponse = response.generate(true, 'No Chat Room Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Room Details Found', 200, result)
            res.send(apiResponse)
        }
    })
}

let deleteChatRoom = (req, res) => {
    let originName = "chatRoomController : deleteChatRoom";
    ChatRoomModel.findOneAndRemove({ 'chatRoomId': req.body.chatRoomId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, originName, 10)
            let apiResponse = response.generate(true, 'Failed To delete chat room', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', originName)
            let apiResponse = response.generate(true, 'No Chat Room Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the chat room successfully', 200, result)
            res.send(apiResponse)
        }
    });// end chat room model find and remove


}// end delete user

//------ get chat messages from chat room
//------ add messages to chat room
/**
 * exporting functions.
 */
module.exports = {

    getChatRoomMessages: getChatRoomMessages,
    getChatRooms: getChatRooms,
    createChatRoom: createChatRoom,
    deleteChatRoom : deleteChatRoom

}
