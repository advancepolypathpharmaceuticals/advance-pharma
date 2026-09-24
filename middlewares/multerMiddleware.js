const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =====================================================
// CREATE UPLOAD FOLDER IF IT DOES NOT EXIST
// =====================================================
function ensureUploadFolder(folderName) {

    const uploadPath = path.join(
        __dirname,
        "../public/uploads",
        folderName
    );

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, {
            recursive: true
        });
    }

    return uploadPath;
}


// =====================================================
// GENERIC UPLOADER
// =====================================================
function createUploader(folderName) {

    const uploadPath = ensureUploadFolder(folderName);

    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },

        filename: function (req, file, cb) {

            const ext = path.extname(file.originalname);

            const uniqueName =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1E9) +
                ext;

            cb(null, uniqueName);
        }
    });

    return multer({
        storage: storage
    });
}


// =====================================================
// USER PROFILE IMAGE UPLOADER
// =====================================================
const userUploadPath = ensureUploadFolder("user");

const userUploader = multer({

    storage: multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, userUploadPath);
        },

        filename: function (req, file, cb) {

            const uniqueName =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1E9) +
                path.extname(file.originalname);

            cb(null, uniqueName);
        }
    }),

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {

            req.fileValidationError = null;

            return cb(null, true);
        }

        req.fileValidationError = "INVALID_FILE_TYPE";

        return cb(null, false);
    },

    limits: {
        fileSize: 2 * 1024 * 1024
    }
});


// =====================================================
// RESUME UPLOADER
// =====================================================
const resumeUploadPath = ensureUploadFolder("resume");

const resumeUploader = multer({

    storage: multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, resumeUploadPath);
        },

        filename: function (req, file, cb) {

            const ext = path.extname(file.originalname);

            const uniqueName =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1E9) +
                ext;

            cb(null, uniqueName);
        }
    }),

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            return cb(null, true);
        }

        const error = new Error(
            "Only PDF and Word documents are allowed"
        );

        error.code = "INVALID_FILE_TYPE";

        return cb(error, false);
    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


module.exports = {

    serviceUploader: createUploader("service"),

    teamUploader: createUploader("team"),

    testimonialUploader: createUploader("testimonial"),

    userUploader: userUploader,

    resumeUploader: resumeUploader
};
