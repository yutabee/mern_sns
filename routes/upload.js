const router = require('express').Router();
const multer = require('multer');

// SET STRAGE(どこに保存するか。ファイルの名前はどうするか)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // cb(null, file.filename + "-" + Date.now());
    cb(null, req.body.name);
    // cb(null, req.body.name);
  },
});

const upload = multer({
  storage: storage,
});

//画像アップロードAPI
router.post("/", upload.single("file"), (req, res) => {
    try {
      
        return res.status(200).json("画像のアップロードに成功しました");
        
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;