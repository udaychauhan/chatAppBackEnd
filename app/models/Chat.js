const mongoose = require('mongoose')

const Schema = mongoose.Schema

let chatSchema = new Schema({

 
  senderName: { type: String, default: '' },
  senderId: { type: String, default: '' },
  message: { type: String, default: '' },
  chatRoom: { type: String, default: '' },
  createdOn: { type: Date, default: Date.now },
  modifiedOn: { type: Date, default: Date.now }

});

mongoose.model('Chat', chatSchema)
