const multer = require('multer');
const {v4:uuidv4} = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads');
    },
    filename: function(req, file, cb) {
        const uniqueFileName = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueFileName + fileExtension);
    }
});

const upload = multer({storage});

module.exports = upload;