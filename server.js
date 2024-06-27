const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());


// MySql Workbench Connections
// const db = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'WJ28@krhps',
//     database: 'mydata'
// });

// Clever Cloud
const db=mysql2.createConnection('mysql://ut8fn4bab7svofmz:Im1aHzx6BFv0wf3gvYzP@bik4yq9uuirci6k1rfre-mysql.services.clever-cloud.com:3306/bik4yq9uuirci6k1rfre');


db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

const newTable = `
CREATE TABLE IF NOT EXISTS favorite_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_name VARCHAR(255) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
 db.query(newTable, (err, result) => {
   if (err) {
     console.error('Error', err);
     return;
   }
   console.log('Table created', result);
 });

// Fetch all favorite packages
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM favorite_packages';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new favorite package
app.post('/', (req, res) => {
    const { package_name, reason } = req.body;
    const sql = 'INSERT INTO favorite_packages (package_name, reason) VALUES (?, ?)';
    db.query(sql, [package_name, reason], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, package_name, reason });
    });
});

 // Route to delete a favorite package
 app.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM favorite_packages WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error deleting favorite package:', err);
        res.status(500).send('Error deleting favorite package');
        return;
      }
      console.log("Fav Pack deleted")
      res.send('Favorite package deleted');

    });
  });
  
  // Route to update the reason for a favorite package
  app.put('/:id', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    db.query('UPDATE favorite_packages SET reason = ? WHERE id = ?', [reason, id], (err, results) => {
      if (err) {
        console.error('Error updating favorite package:', err);
        res.status(500).send('Error updating favorite package');
        return;
      }
      res.send(reason );
    });
  });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
