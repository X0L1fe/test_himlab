const path = require('path');
const express = require('express');
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const app = express();
const PORT = process.env.PORT || 3000;

const router = express.Router();

const adminJs = new AdminJS({ databases: [], rootPath: '/admin' });
const adminRouter = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, adminRouter);

app.use(express.static(path.join(__dirname)));
app.use('/', router);

router.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'catalog.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

router.get('/card', (req, res) => {
    res.sendFile(path.join(__dirname, 'card.html'));
});

router.get('/basket', (req, res) => {
  res.sendFile(path.join(__dirname, 'basket-one.html'));
});

router.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, 'contacts.html'));
});

router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

router.get('/price', (req, res) => {
    res.sendFile(path.join(__dirname, 'price.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
