const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convert() {
  const publicDir = path.join(__dirname, '..', 'public');

  // 1. Converter og-image.svg em og-image.png (1200x630)
  const ogSvg = path.join(publicDir, 'og-image.svg');
  const ogPng = path.join(publicDir, 'og-image.png');
  await sharp(ogSvg)
    .resize(1200, 630)
    .png({ quality: 100 })
    .toFile(ogPng);
  console.log('[CONVERT] public/og-image.png gerado com sucesso (1200x630).');

  // 2. Converter icon.svg em icon.png (512x512)
  const iconSvg = path.join(publicDir, 'icon.svg');
  const iconPng = path.join(publicDir, 'icon.png');
  await sharp(iconSvg)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(iconPng);
  console.log('[CONVERT] public/icon.png gerado com sucesso (512x512).');

  // 3. Converter apple-touch-icon.svg em apple-icon.png (180x180)
  const appleSvg = path.join(publicDir, 'apple-touch-icon.svg');
  const applePng = path.join(publicDir, 'apple-icon.png');
  await sharp(appleSvg)
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(applePng);
  console.log('[CONVERT] public/apple-icon.png gerado com sucesso (180x180).');
}

convert().catch((err) => {
  console.error('Erro na conversão:', err);
  process.exit(1);
});
