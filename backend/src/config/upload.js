const multer = require('multer');
const path = require('path');

module.exports = {
  fileFilter: (req, file, cb) => {
    cb(null, file.originalname !== 'undefined');
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
