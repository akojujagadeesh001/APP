const db = require('./db.js');

// Create tables
db.exec(`
  DROP TABLE IF EXISTS bookings;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS services;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('customer', 'provider', 'admin')),
    lat REAL,
    lng REAL
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price_estimate INTEGER
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    provider_id INTEGER,
    service_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'completed')),
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    address TEXT NOT NULL,
    details TEXT,
    final_price INTEGER,
    rating INTEGER,
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(provider_id) REFERENCES users(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  );
`);

console.log("Tables created successfully.");

// Insert initial services
const insertService = db.prepare('INSERT INTO services (name, category, description, price_estimate) VALUES (?, ?, ?, ?)');
const count = db.prepare('SELECT COUNT(*) as count FROM services').get().count;

if (count === 0) {
  insertService.run('Standard Home Cleaning', 'Cleaning', 'Deep cleaning of home (up to 3 bedrooms)', 120);
  insertService.run('Pipe Repair', 'Plumbing', 'Fixing leaks, clogged drains, pipe installations', 80);
  insertService.run('Wiring Repair', 'Electrical', 'Fixing wiring issues, socket installations', 100);
  insertService.run('Furniture Assembly', 'Handyman', 'Putting together flat pack furniture, general repairs', 60);
  console.log("Services seeded successfully.");
}

// Optional Admin Account
// Optional Admin Account
const insertUser = db.prepare('INSERT OR IGNORE INTO users (name, email, password, role, lat, lng) VALUES (?, ?, ?, ?, ?, ?)');
// we'll just store plain text passwords for simplicity since its mock
insertUser.run('Admin Userson', 'admin@servenow.com', 'admin123', 'admin', null, null);
insertUser.run('Provider Pete', 'pete@servenow.com', 'provider123', 'provider', 40.7128, -74.0060); // NY
insertUser.run('Provider Sarah', 'sarah@servenow.com', 'provider123', 'provider', 40.7282, -73.9942); // NY
insertUser.run('Provider John', 'john@servenow.com', 'provider123', 'provider', 40.7050, -74.0093); // NY
insertUser.run('Customer Cassie', 'cassie@servenow.com', 'customer123', 'customer', null, null);

console.log("Seeding complete.");
