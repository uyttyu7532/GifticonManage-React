const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});

connection.connect();

const multer = require('multer');
// 사용자의 파일이 업로드 되는 폴더
const upload = multer({dest: './upload'})

app.get('/api/gifticons', (req, res) => {
    connection.query(
      "SELECT * FROM GIFTICON",
      (err, rows, fields) => {
        res.send(rows);
      }
    )
});

app.use('/barcode_img',express.static('./upload'));
app.post('/api/gifticons', upload.single('barcode_img'), (req, res)=> {
  let sql = 'INSERT INTO GIFTICON VALUES (null, ?, ?, ?, ?)';
  let barcode_img = '/barcode_img/' + req.file.filename;
  let name = req.body.name;
  let exp_date = req.body.exp_date;
  let used = req.body.used;
  let params = [barcode_img, name, exp_date, used];
  console.log(barcode_img);
  console.log(name);
  console.log(exp_date);
  console.log(used);
  connection.query(sql, params,
      (err, rows, fields) => {
        res.send(rows);
        console.log(err);
        console.log(rows);
      }
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));