const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')();
const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

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
const upload = multer({ dest: './upload' })

app.get('/api/gifticons', (req, res) => {
  connection.query(
    "SELECT * FROM GIFTICON ORDER BY CASE WHEN used IN ('미사용') THEN 0 ELSE 1 END",
    (err, rows, fields) => {
      res.send(rows);
    }
  )
});

app.get('/.well-known/pki-validation/08994B5BF518EB9466BE56F612849BF6.txt', (req, res) => {
  res.send(`AED329E340B265007BA08E3DF576485AB9E9FEF4FAD3D96D09A6B53082CC76C6<br>
  comodoca.com<br>
  8d3eabd0094f156`);
});

app.use('/barcode_img', express.static('./upload'));
app.post('/api/gifticons', upload.single('barcode_img'), (req, res) => {
  let sql = 'INSERT INTO GIFTICON VALUES (null, ?, ?, ?, \'미사용\', now(), 0, null)';
  let barcode_img = '/barcode_img/' + req.file.filename;
  let name = req.body.name;
  let exp_date = req.body.exp_date;
  let used = req.body.used;
  let deletedDate = req.body.deletedDate;
  let params = [barcode_img, name, exp_date, used, deletedDate];
  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.delete('/api/gifticons:id', (req, res) => {
  let sql = 'UPDATE GIFTICON SET used = \'사용완료\', deletedDate = now(), isDeleted = 1 WHERE id = ?';
  let params = [req.params.id];

  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows);

    }
  )
});

// require('greenlock-express').init({
//   packageRoot: __dirname,
//   configDir: './greenlock.d',
//   maintainerEmail: 'uyttyu7532@naver.com',
// })
//   .server(app);

app.listen(port, () => console.log(`Listening on port ${port}`));