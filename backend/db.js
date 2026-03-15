const path = require('path');
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT, phone TEXT);
  CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INTEGER, providerId INTEGER, serviceId INTEGER, description TEXT, address TEXT, dateTime TEXT, status TEXT DEFAULT 'pending', totalPrice REAL, platformFee REAL, providerPayout REAL);
`);
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@servenow.com');
if (!existing) {
  db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)').run('Admin','admin@servenow.com','admin123','admin');
  db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)').run('Cassie','cassie@servenow.com','customer123','customer');
  db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)').run('Pete','pete@servenow.com','provider123','provider');
}
module.exports = db;
```

Press **Ctrl+S** to save.

---

**Step 2 — Push to GitHub**

In Git Bash type these one by one:
```
cd "/c/Users/priya/OneDrive/Desktop/ServeNow"
git add .
git commit -m "fix db"
git push origin master