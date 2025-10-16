const Project = require('../models/Project');
const Task = require('../models/Task');


const createTask = async (req, res) => {
    try{
        const {projectId, title, description, assignedTo} = req.body;
        if(!projectId || !title){
        return res.status(400).json({ success: false, message: "Project ID and title are required" });
        }
        const project = await Project.findById(projectId);
        if(!project) return res.status(404).json({ success: false, message: "Project not found" });
        const taskCount = await Task.countDocuments({projectId});
        const task = new Task({
        projectId,
        title,
        description,
        assignedTo,
        order:taskCount
        });
        await task.save();
        res.status(201).json({ success: true, message: "Task created", task });
    }catch(err){
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getTaskByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.find({ projectId }).sort({ order: 1 });
      res.status(200).json({ success: true, tasks });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

const updateTask = async (req,res)=>{
    try{
        const {taskId} = req.params;
        const updates  = req.body;

        const task  = await Task.findByIdAndUpdate(taskId,updates,{new:true});
        if(!task) return res.status(404).json({ success: false, message: "Task not found" });
        res.status(200).json({ success: true, message: "Task updated", task });
    }catch(err){
        res.status(500).json({ success: false, message: "Server error" });
    }
}
const updateTaskStatus = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status, order } = req.body;
  
      console.log('Updating task:', taskId, '→', status, 'order:', order);
  
      const task = await Task.findByIdAndUpdate(
        taskId,
        { status, order },
        { new: true }
      );
  
      if (!task)
        return res.status(404).json({ success: false, message: 'Task not found' });
  
      res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        task,
      });
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

const deleteTask = async (req,res) =>{
    try{
    const {taskId} = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if(!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted" }); 
    }catch(err){
        res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = {
    createTask,
    getTaskByProject,
    updateTask,
    updateTaskStatus,
    deleteTask
}