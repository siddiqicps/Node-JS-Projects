const express = require('express')
const multer = require('multer');
const cors = require('cors')
const fs = require('node:fs/promises');
const path = require("path");
var mammoth = require("mammoth");
const {pool} = require("./connection")

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload-file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
})

app.get('/get-policy', async (req, res) => {
    try {
      const data = await fs.readFile('./uploads/1742583253929-Backup Policy_v1.1_2025 - Copy.docx', { encoding: 'utf8' });
      console.log(data);
      res.json({ message: 'File fetched successfully', data: data });
      // res.send(data)
    } catch (err) {
      console.error(err);
    }
  // res.json({ message: 'Unable to fetch file', err: 'err' });
})

app.get('/get-policy-html', async (req, res) => {
  try {
    mammoth.convertToHtml({path: "./uploads/1742583253929-Backup Policy_v1.1_2025 - Copy.docx"})
    .then(function(result){
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        res.json({ message: messages, html: html });
    })
    .catch(function(error) {
        console.error(error);
    });
  } catch (err) {
    console.error(err);
  }
  // res.json({ message: 'Unable to fetch file', err: 'html' });
})

app.get('/get-policy-text', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM `policies` Where is_active=1 Order By id desc Limit 1');
    // Connection is automatically released when query resolves
    res.json({message: 'Policy fetched successfully', data: rows})
  } catch (err) {
    console.error(err);
  }
  // res.json({ message: 'Unable to fetch file', err: 'html' });
})

app.post('/save-policy-text', async (req, res) => {
  try {
    // const conn = await pool.getConnection();
    // console.log(conn)
    console.log(req.body)
    // For pool initialization, see above
    let query = 'Insert Into policies(title, content, version) Values(?, ?, ?)';
    const params = [req.body.title, req.body.content, req.body.version];
    let msg = 'inserted';
    if(req.body.id){
      query = 'Update Table policies Set title = ?, content = ?, version = ?';
      msg = 'updated';
    }
    const [rows, fields] = await pool.query(query, params);
    res.json({message: `Policy ${msg} successfully`})
    // Connection is automatically released when query resolves
  } catch (err) {
    console.error(err);
  }
  // res.json({ message: 'Unable to fetch file', err: 'html' });
})

app.use('/static', express.static(path.join(__dirname, 'uploads')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})