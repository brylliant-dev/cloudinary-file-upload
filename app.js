require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    if (error) return res.status(500).send('Upload to Cloudinary failed');

    res.send({ message: 'File uploaded successfully', url: result.secure_url });
  }).end(file.buffer);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
