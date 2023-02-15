const multer = require('multer');
const path = require('path');
const { v1: uuidV4 } = require('uuid');

// Multer config
module.exports = multer({
  storage: multer.diskStorage({
    filename: function (req, file, cb) {
      const uniqueSuffix = uuidV4();
      cb(null, file.originalname + '-' + uniqueSuffix);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'));
      return;
    }

    cb(null, true);
  },
});
