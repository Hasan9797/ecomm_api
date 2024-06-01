import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, "../../", "Uploads");
// Multer uchun yuklash konfiguratsiyasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolderPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname); //
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

function checkfile(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|/;
  const exnames = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypes = filetypes.test(file.mimetype);

  if (exnames && mimetypes) {
    return cb(null, true);
  } else {
    cb("Enter: You can only upload image files");
  }
}

export const upload = multer({
  storage: storage,
  // limites: { fileSize: 1000000 },
  filFilter: function (req, file, cb) {
    checkfile(file, cb);
  },
});

export const unlinkFile = (unlinkFiles = []) => {
  // Fayl kengaytmalarini aniqlash uchun regex
  const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;

  // Upload papkasidagi barcha fayllarni o'qish
  fs.readdir(uploadFolderPath, (err, files) => {
    if (err) {
      console.error(
        "Upload papkasidagi fayllarni o'qishda xatolik yuz berdi:",
        err
      );
      return;
    }

    // Fayllarni filtrlash va faqat rasm fayllarini tanlash
    const imageFiles = files.filter(
      (file) => imageExtensions.test(file) && unlinkFiles.includes(file)
    );

    // Rasm fayli yoke filelarini o'chirish
    imageFiles.forEach((file) => {
      const filePath = path.join(uploadFolderPath, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`${file} faylini o'chirishda xatolik yuz berdi:`, err);
        } else {
          console.log(`${file} muvaffaqiyatli o'chirildi.`);
        }
      });
    });
  });
};
