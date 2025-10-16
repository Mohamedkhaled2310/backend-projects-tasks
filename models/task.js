const mongoose  = require("mongoose");


const taskSchema = new mongoose.Schema({
    projectId : {type:mongoose.Schema.Types.ObjectId,ref:'Project',required:true},
    title : {type: String, required: true},
    description : {type: String},
    status : {type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo'},
    order : {type:Number,default:0},
    assignedTo : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

taskSchema.index({projectId: 1, order: 1}); // save ordered

module.exports= mongoose.model("Task",taskSchema);