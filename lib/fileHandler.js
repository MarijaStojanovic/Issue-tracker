const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    try {
      const folderToSave = path.join(__dirname, '../files/');

      if (!fs.existsSync(folderToSave)) {
        fs.mkdirSync(folderToSave);
      }
      cb(null, folderToSave);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const originalFileName = path.basename(file.originalname, path.extname(file.originalname));
    const fileExtension = path.extname(file.originalname);

    cb(null, `${originalFileName}_${Date.now()}${fileExtension}`);
  },
});

module.exports.fileUpload = multer({
  storage,
  limits: {
    fileSize: 10000000, // 10Mb
  },
});
