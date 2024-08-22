import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import sequelize from './database.js'; // Инициализация базы данных
import Product from './models/product.js'; // Модель продукта

// Импорт ComponentLoader
import { ComponentLoader } from 'adminjs';

AdminJS.registerAdapter(AdminJSSequelize);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Настройка Multer для сохранения изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Saving file to: ${path.join(__dirname, 'images/product-images')}`);
    cb(null, path.join(__dirname, 'images/product-images'));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log(`Generated file name: ${fileName}`);
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Инициализация ComponentLoader
const componentLoader = new ComponentLoader();
const filePath = path.join(__dirname, 'components/ImageUploadComponent.jsx');
console.log('Checking file path:', filePath);

if (!fs.existsSync(filePath)) {
  console.error('File does not exist:', filePath);
} else {
  console.log('File found:', filePath);
}

const imageUploadComponent = componentLoader.add('ImageUploadComponent', filePath);
console.log('Component registered:', imageUploadComponent);

(async () => {
  try {
    console.log('Synchronizing database...');
    await sequelize.sync();
    console.log("Database synchronized.");

    console.log('Initializing AdminJS...');
    // Настройка AdminJS
    const adminJs = new AdminJS({
      databases: [sequelize],
      rootPath: '/admin',
      resources: [
        {
          resource: Product,
          options: {
            properties: {
              image: {
                type: 'mixed',
                custom: {
                  component: imageUploadComponent, // Привязка компонента через ComponentLoader
                },
              },
              id: { isTitle: true },
              product: { type: 'string', isTitle: true },
              description: { type: 'textarea' },
              key: { type: 'string' },
              manufacturer: { type: 'string' },
              country: { type: 'string' },
              weight: { type: 'string' },
              price: { type: 'string' },
              material: { type: 'string' },
              Product_category: { type: 'string' },
              Brands: { type: 'string' },
            },
            actions: {
              new: {
                before: async (request) => {
                  console.log('Before creating new product...');
                  if (request.payload.uploadedImage) {
                    const file = request.payload.uploadedImage;
                    const fileName = `${Date.now()}-${file.name}`;
                    const filePath = path.join(__dirname, 'images/product-images', fileName);

                    console.log(`Saving uploaded image to: ${filePath}`);

                    // Сохранение файла
                    await new Promise((resolve, reject) => {
                      const writeStream = fs.createWriteStream(filePath);
                      writeStream.write(file.buffer);
                      writeStream.on('finish', resolve);
                      writeStream.on('error', reject);
                      writeStream.end();
                    });

                    console.log(`Image saved successfully as ${fileName}`);
                    // Сохранение пути файла в поле image
                    request.payload.image = `/images/product-images/${fileName}`;
                  }
                  return request;
                },
              },
              edit: {
                before: async (request) => {
                  console.log('Before editing product...');
                  if (request.payload.uploadedImage) {
                    const file = request.payload.uploadedImage;
                    const fileName = `${Date.now()}-${file.name}`;
                    const filePath = path.join(__dirname, 'images/product-images', fileName);

                    console.log(`Saving uploaded image to: ${filePath}`);

                    // Сохранение файла
                    await new Promise((resolve, reject) => {
                      const writeStream = fs.createWriteStream(filePath);
                      writeStream.write(file.buffer);
                      writeStream.on('finish', resolve);
                      writeStream.on('error', reject);
                      writeStream.end();
                    });

                    console.log(`Image saved successfully as ${fileName}`);
                    // Сохранение пути файла в поле image
                    request.payload.image = `/images/product-images/${fileName}`;
                  }
                  return request;
                },
              },
            },
          },
        },
      ],
      // Добавляем ComponentLoader в настройки AdminJS
      componentLoader,
    });

    console.log('Setting up AdminJS router...');
    const adminRouter = AdminJSExpress.buildRouter(adminJs);
    app.use(adminJs.options.rootPath, adminRouter);
    console.log(`AdminJS configured and available at: ${adminJs.options.rootPath}`);

    // Статические файлы
    console.log(`Serving static files from: ${path.join(__dirname)}`);
    app.use(express.static(path.join(__dirname)));

    // Маршруты для страниц
    console.log('Setting up routes...');
    router.get('/catalog', (req, res) => {
      console.log('Serving /catalog');
      res.sendFile(path.join(__dirname, 'catalog.html'));
    });

    router.get('/about', (req, res) => {
      console.log('Serving /about');
      res.sendFile(path.join(__dirname, 'about.html'));
    });

    router.get('/card', (req, res) => {
      console.log('Serving /card');
      res.sendFile(path.join(__dirname, 'card.html'));
    });

    router.get('/basket', (req, res) => {
      console.log('Serving /basket');
      res.sendFile(path.join(__dirname, 'basket-one.html'));
    });

    router.get('/contacts', (req, res) => {
      console.log('Serving /contacts');
      res.sendFile(path.join(__dirname, 'contacts.html'));
    });

    router.get('/index', (req, res) => {
      console.log('Serving /index');
      res.sendFile(path.join(__dirname, 'index.html'));
    });

    router.get('/order', (req, res) => {
      console.log('Serving /order');
      res.sendFile(path.join(__dirname, 'order.html'));
    });

    router.get('/price', (req, res) => {
      console.log('Serving /price');
      res.sendFile(path.join(__dirname, 'price.html'));
    });

    app.use('/', router);

    // Обработка ошибки 404
    app.use((req, res) => {
      console.log('404 Error - Page not found');
      res.status(404).sendFile(path.join(__dirname, 'error.html'));
    });

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error during Sequelize.sync():", error);
  }
})();