const multer = require("multer");

const MINE_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MINE_TYPE[file.mimetype];
    callback(null, name + "_" + Date.now() + "." + extension);
  },
});

const upload = multer({ storage });

module.exports = upload.single("logo");
