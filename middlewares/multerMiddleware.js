const multer = require("multer");
const path = require("path"); // Add this import

function createUploader(folderName){
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/' + folderName);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  });
  return multer({ storage: storage });
}

// Profile picture uploader with image filtering
const userUploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/user/');
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, uniqueName);
    }
  }),
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      req.fileValidationError = null;
      return cb(null, true);
    } else {
      req.fileValidationError = "INVALID_FILE_TYPE";
    return cb(null, false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// Add resume uploader with file filtering
const resumeUploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/resume/');
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
      cb(null, uniqueName);
    }
  }),
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = { 
    serviceUploader: createUploader("service"), 
    teamUploader: createUploader("team"), 
    testimonialUploader: createUploader("testimonial"), 
    userUploader: userUploader, // Use the new userUploader with image filtering
    resumeUploader: resumeUploader
};