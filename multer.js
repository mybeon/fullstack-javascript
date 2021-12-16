const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const fileExtension = file.mimetype.split("/")[1];
    const randomNumber = Math.floor(Math.random() * 4000);
    cb(null, Date.now() + "-" + randomNumber + "." + fileExtension);
  },
});

const upload = multer({
  storage,
  limits: 1024 * 1024,
  fileFilter: (req, file, cb) => {
    if (req.session.user && (file.mimetype == "image/jpeg" || file.mimetype == "image/png")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

module.exports = upload;
