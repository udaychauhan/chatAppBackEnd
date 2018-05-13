const mongoose = require('mongoose')

const Schema = mongoose.Schema

let chatRoomSchema = new Schema({
  chatRoomId: { type: String, unique: true, required: true },
  chatRoomName: { type: String, default: '' },
  creatorName: { type: String, default: '' },
  creatorId: { type: String, default: '' },
  createdOn: { type: Date, default: Date.now },
  modifiedOn: { type: Date, default: Date.now }
});

mongoose.model('ChatRoom', chatRoomSchema)
