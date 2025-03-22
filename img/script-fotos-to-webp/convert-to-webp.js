const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Папка с изображениями
const inputFolder = './';  // Текущая папка
const outputFolder = './output';  // Папка для результатов

// Создаем папку для результата, если её нет
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Читаем все файлы .png, .jpeg и .jpg в папке
fs.readdirSync(inputFolder)
  .filter(file => ['.png', '.jpeg', '.jpg'].includes(path.extname(file).toLowerCase()))
  .forEach(file => {
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, path.basename(file, path.extname(file)) + '.webp');

    // Преобразуем изображение в WebP
    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath, (err, info) => {
        if (err) {
          console.error(`Ошибка при обработке ${file}:`, err);
        } else {
          console.log(`Обработано ${file}: ${info.size / 1024} KB`);
        }
      });
  });
