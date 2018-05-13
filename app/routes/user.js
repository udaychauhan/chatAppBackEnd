const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;


    //app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.getAllUser);//, auth.isAuthorized


    // params: userId.
   // app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);


    //-- SignUp New User
    app.post(`${baseUrl}/signup`, userController.signUpFunction);
    /**
	* @api {post} /api/v1/user/signup Create New  User
	* @apiVersion 0.0.1
	* @apiGroup  User
	*
	* @apiParam {string} firstName name of the suer passed as a body parameter
	* @apiParam {string} lastName of the user passed as a body parameter
	* @apiParam {string} email email of the user. (body params) (required)
    * @apiParam {string} password password of the user. (body params) (required)
	
	* @apiParam {number} mobileNumber category of the user passed as a body parameter
	*
	  @apiSuccessExample {json} Success-Response:
	*  {
	*   "error": false,
	*   "message": "User Created.",
	*   "status": 200,
	*   "data": [
    *				{
    *					_id: "string",
                        firstName: "string",
                        lastName: "string",
                        email: "string",
                        mobileNumber: "number",
                        userId:"string",
                        createdOn:"string"
	*                   __v: number
    *				}
	*   		]
	*  	}
     **/

    //--- LOGIN    
    app.post(`${baseUrl}/login`, userController.loginFunction);
    /**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/login User Login.
    * @apiGroup  User
    *
    * @apiParam {string} email email of the user. (body params) (required)
    * @apiParam {string} password password of the user. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
           "error": false,
           "message": "Login Successful",
           "status": 200,
           "data": {
               "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
               "userDetails": {
               "mobileNumber": 2234435524,
               "email": "someone@mail.com",
               "lastName": "Sengar",
               "firstName": "Uday",
               "userId": "-E9zxTYA8"
           }

       }
   */

    //params : email
    app.post(`${baseUrl}/forgotpassword`, userController.forgotPassword);
    /**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/forgotpassword Forgot Password.
    * @apiGroup  User
    * 
    * @apiParam {string} email email of the user. (body params) (required)
   
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * @apiSuccess {object} Use this token to as authentication  token to change password
    * 
    * @apiSuccessExample {object} Success-Response:
        {
           "error": false,
           "message": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc"
           "status": 200,
           "data": null

       }
   */
   
    //--Change password
    app.post(`${baseUrl}/changepassword`, userController.verifyUserTokenAndChangePassword);
    /**
    * @apiGroup User
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/changepassword  Change Password.
    *
    * @apiParam {string} token Token generated from forgot password api. (body params) (required)
    * * @apiParam {string} email Email of the user. (body params) (required)
    * 
   
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
           "error": false,
           "message": "Password changed for uday@gmail.com"
           "status": 200,
           "data": null

       }
   */   


    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);

}
