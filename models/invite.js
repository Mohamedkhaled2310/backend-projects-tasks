const mongoose = require("mongoose");

const inviteShema = new mongoose.Schema({
    email: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    token: { type: String, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '7d' }});   

module.exports = mongoose.model('Invite', inviteShema);