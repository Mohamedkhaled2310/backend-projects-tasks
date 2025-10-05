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


const addMemberToProject = async (req, res) => {
    try{
        const {projectId} = req.params;
        const {memberId} = req.body;

        const project = await Project.findById(projectId);
        if(!project) return res.status(404).json({success: false,message:"Project not found"});

        const user = await User.findById(memberId);
        if(!user) return res.status(404).json({success: false,message:"User not found"});

        if(project.members.includes(memberId)) return res.status(400).json({success: false,message:"User is already a member of the project"});
        project.members.push(memberId);
        await project.save();

        res.json({success: true,message:"Member added successfully", project});
    }catch(err){
        res.status(500).json({success: false,message:"Server error"});
    }
};
module.exports = {
    createProject,
    getProjectsForUser,
    addMemberToProject
}