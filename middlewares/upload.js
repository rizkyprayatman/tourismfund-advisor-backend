const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const awsBucket = require("../config/aws");

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.mimetype === "application/vnd.ms-powerpoint"
    ) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

const upload = function fileUpload(destinationPath) {
    return multer({
        fileFilter: fileFilter,
        storage: multerS3({
            s3: awsBucket,
            bucket: process.env.R2_BUCKET_NAME,
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(
                    null,
                    destinationPath +
                    "/" +
                    Date.now().toString() +
                    path.extname(file.originalname)
                );
            },
        }),
    });
};

module.exports = upload;
