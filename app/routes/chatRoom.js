const express = require('express');
const router = express.Router();
const chatRoomController = require("./../../app/controllers/chatRoomController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/chatRoom`;


  //---- create chat room 
  // body params: chatRoomName,creatorName,creatorId,authToken.
  app.post(`${baseUrl}/create`, auth.isAuthorized, chatRoomController.createChatRoom);
  /**
   * @apiGroup ChatRoom
   * @apiVersion  1.0.0
   * @api {post} /api/v1/chatRoom/create Create A Chat Room.
   *
   * @apiParam {string} authToken Auth Token (body param) (required)
   * @apiParam {string} chatRoomName Chat Room Name  (body param) (required)
   * @apiParam {string} creatorName Chat Room Creator Name  (body param) (required)
   * @apiParam {string} creatorId Chat Room Creator Id  (body param) (required)
   
   * 
  
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
          "error": false,
          "message": "Chat Room Created"
          "status": 200,
           "data": {
             chatRoomId:string,
             chatRoomName: string,
             creatorName: string,
             creatorId: string,
             createdOn: string,
             modifiedOn: string
          }
      }
  */


  //---- get chat room 
  //params: authToken
  app.get(`${baseUrl}/getall`, auth.isAuthorized, chatRoomController.getChatRooms);
  /**
   * @apiGroup ChatRoom
   * @apiVersion  1.0.0
   * @api {post} /api/v1/chatRoom/getall Get All Chat Rooms.
   *
   * @apiParam {string} authToken Auth Token.Use chatRoom/getall?authToken="enter token here" (query param) (required)
   
   * 
  
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
          "error": false,
          "message": "All Room Details Found"
          "status": 200,
          "data": {
             chatRoomId:string,
             chatRoomName: string,
             creatorName: string,
             creatorId: string,
             createdOn: string,
             modifiedOn: string
          }

      }
  */

  //---- delete chat room 
  // body params: chatRoomId,authToken.
  app.post(`${baseUrl}/delete`, auth.isAuthorized, chatRoomController.deleteChatRoom);
  /**
   * @apiGroup ChatRoom
   * @apiVersion  1.0.0
   * @api {post} /api/v1/chatRoom/delete Delete A Chat Room.
   *
   * @apiParam {string} authToken Auth Token (body param) (required)
   * @apiParam {string} chatRoomId Chat Room Id  (body param) (required)
   
   * 
  
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
          "error": false,
          "message": "Deleted the chat room successfully"
          "status": 200,
          "data":null
      }
  */

}

// for events and emitters
 /**
    * @apiGroup Listen Events
    * @apiVersion  1.0.0
    * @api {post}  Listen From server.
    *
    * @apiParam {string} verifyUser 
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Object-Received:
    * //--verifyUser
       obj = {
            message: 'Socket Connected',
        }
    * 
    * @apiParam {string} errorEvent 
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
     * @apiSuccessExample {object} Object-Received:
    * //--errorEvent
       "a message string"
    *
    * @apiParam {string} onlineUserList 
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
     * @apiSuccessExample {object} Object-Received:
    * //--onlineUserList
        obj = {
                        message: string,
                        sendBy: string,
                        list: [{ userId: currentUser.userId, fullName: fullName }]
              }
    *
    * @apiParam {string} chatMsg 
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
     * @apiSuccessExample {object} Object-Received:
    * //--chatMsg
        obj = {
                        senderName: string,
                        senderId: string,
                        message: string
              }
    *  
    * @apiParam {string} userTyping 
  
    * 
    * @apiSuccessExample {object} Object-Received:
    * //--userTyping
        obj = {
                        senderName: string,
                       
              }
    * 
    *  
    * @apiParam {string} myMsg 
  
    * 
    * @apiSuccessExample {object} Object-Received:
    * //--myMsg
        obj = [{
                        senderName: string,
                        senderId: string,
                        message: string
                       
              }]
    *   
   */

    /**
    * @apiGroup Emit Events
    * @apiVersion  1.0.0
    * @api {post}  Send From Front End.
    *
    * @apiParam {string} setUser 
   
    * 
    * @apiSuccessExample {object} Object-Sent:
    * //--setUser
       obj = {
            authToken: string,
            chatRoomId; string
        }
    * 
    * @apiParam {string} chatMsg 
   
    * 
    * @apiSuccessExample {object} Object-Send:
    * //--chatMsg
        obj = {
                        senderName: string,
                        senderId: string,
                        message: string
              }
    *  
    * @apiParam {string} userTyping 
  
    * 
    * @apiSuccessExample {object} Object-Received:
    * //--userTyping
        obj = {
                        senderName: string,
                       
              }
    * 
    *  
    * * @apiParam {string} allChatRoomMsg 
  
    * 
    * @apiSuccessExample {object} Object-Received:
    * //--userTyping
       " "
    * 
    */   
