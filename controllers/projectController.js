const User = require("../models/user");
const Project = require("../models/Project");


const createProject = async (req, res) => {
    try {
        const {title,description} = req.body;
        if(!title){
            return res.status(400).json({success: false,message:"Project title is required"});
        }
        const newProject = new Project({
            title,
            description,
            createdBy: req.user.id,
            members: [req.user.id]
        });
        await newProject.save();
        res.status(201).json({success: true,message:"Project created successfully", project: newProject});
    }catch(err){
        res.status(500).json({success: false,message:"Server error"});
    }
};

const getProjectsForUser = async (req, res) => {
    try{
        const projects = await Project.find({members: req.user.id})
        .populate('createdBy', 'name email')
        .populate('members', 'name email');
        res.status(200).json({success: true, projects});
    }catch(err){
        res.status(500).json({success: false,message:"Server error"});
    }
};
const getProjectById = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('members', 'name email');
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json({ project });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };


  const addMemberToProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }
  
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const alreadyMember = project.members.some((id) => id.equals(user._id));
      if (alreadyMember) {
        return res.status(400).json({ success: false, message: "User is already a member of the project" });
      }
  
      project.members.push(user._id);
      await project.save();
  
      const updatedProject = await Project.findById(projectId).populate('members', 'name email');
  
      res.status(200).json({
        success: true,
        message: "Member added successfully",
        project: updatedProject,
      });
    } catch (err) {
      console.error("Error adding member:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
module.exports = {
    createProject,
    getProjectsForUser,
    getProjectById,
    addMemberToProject
}