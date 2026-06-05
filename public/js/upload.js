/**
 * @fileoverview Manejo de upload de imágenes con FileReader y compresión con Canvas.
 * Comprime y convierte la imagen a Base64 antes de enviarla al servidor.
 */

const fileInput = document.getElementById('imagen');
const preview = document.getElementById('preview');
const imgBase64Input = document.getElementById('imgBase64');
const mimeTypeInput = document.getElementById('mimeType');

/**
 * @function comprimirImagen
 * @description Comprime una imagen usando Canvas y la devuelve como Base64.
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo en px
 * @param {number} quality - Calidad de compresión (0-1)
 * @returns {Promise<string>} Base64 de la imagen comprimida
 */

function comprimirImagen(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

if (fileInput) {
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validación de peso(5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB');
      fileInput.value = '';
      return;
    }

    const base64Completo = await comprimirImagen(file);

    preview.src = base64Completo;
    preview.classList.remove('hidden');

    const partes = base64Completo.split(',');
    const base64puro = partes[1];

    imgBase64Input.value = base64puro;
    mimeTypeInput.value = file.type;
  });
}
