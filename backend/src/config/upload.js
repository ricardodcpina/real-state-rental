const multer = require('multer');
const path = require('path');

const errors = require('../errors');

module.exports = {
  fileFilter: (req, file, cb) => {
    if (file.originalname !== 'undefined') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', '..', 'public', 'images'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);

      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
};
