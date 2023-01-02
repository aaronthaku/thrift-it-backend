const multer = require("multer");
const allowedMimeTypes = ["audio/wav", "audio/mp3", "audio/mpeg"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio_book") {
      cb(null, "./audiobooks");
    } else if (file.fieldname === "book_img") {
      cb(null, "./bookImgs");
    } else if (file.fieldname === "e_book") {
      cb(null, "./ebooks");
    } else if (file.fieldname === "user_img") {
      cb(null, "./userImages");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (file.fieldname === "audio_book") {
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "e_book") {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "book_img") {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "user_img") {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};

const uploadFile = multer({
  storage: storage,
  fileFilter: filter,
});

module.exports = uploadFile;
