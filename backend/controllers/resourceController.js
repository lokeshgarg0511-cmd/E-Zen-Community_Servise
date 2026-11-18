const StudyResource = require("../models/StudyResource");

// @desc    Get study materials and syllabi
// @route   GET /api/resources
// @access  Private
exports.getResources = async (req, res) => {
  try {
    const { institutionType, courseOrClass } = req.query;
    let query = {};
    if (institutionType) query.institutionType = institutionType;
    if (courseOrClass) query.courseOrClass = courseOrClass;

    const resources = await StudyResource.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload or publish study resource
// @route   POST /api/resources
// @access  Private (Faculty, Admin)
exports.uploadResource = async (req, res) => {
  try {
    const { title, description, institutionType, courseOrClass, subject, fileUrl, fileType, fileSize } = req.body;

    const resource = await StudyResource.create({
      title,
      description,
      institutionType: institutionType || (req.user.schoolClass ? "school" : "college"),
      courseOrClass: courseOrClass || "General",
      subject: subject || "General",
      fileUrl: fileUrl || "https://ezen-storage.edu/resources/sample.pdf",
      fileType: fileType || "PDF",
      fileSize: fileSize || "1.8 MB",
      uploadedBy: req.user._id,
      uploadedByName: req.user.fullName || "Faculty Member",
    });

    res.status(201).json({
      success: true,
      message: "Study resource published successfully!",
      resource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete study resource
// @route   DELETE /api/resources/:id
// @access  Private (Faculty, Admin)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await StudyResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    if (req.user.role !== "admin" && String(resource.uploadedBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this resource" });
    }

    await resource.deleteOne();
    res.json({ success: true, message: "Resource removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
