const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const countFile = path.join(__dirname, 'mascot_count.json');
const contactsFile = path.join(__dirname, 'contacts.json');

function getCount() {
  try {
    const data = fs.readFileSync(countFile, 'utf8');
    return JSON.parse(data).count || 0;
  } catch {
    return 0;
  }
}
function setCount(count) {
  fs.writeFileSync(countFile, JSON.stringify({ count }), 'utf8');
}
function addContact(contact) {
  let contacts = [];
  try {
    contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
  } catch {}
  contacts.push(contact);
  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');
}

app.get('/api/mascot/count', (req, res) => {
  res.json({ count: getCount() });
});
app.post('/api/mascot/interact', (req, res) => {
  let count = getCount() + 1;
  setCount(count);
  res.json({ count });
});
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required.' });
  addContact({ name, email, message, date: new Date().toISOString() });
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 