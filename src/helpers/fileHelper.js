import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, "../../", "Uploads");

// Fayllarni vaqtinchalik saqlash uchun katalogni tekshirish va yaratish
if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolderPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = new Date() + "-" + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

function checkfile(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Enter: You can only upload image files");
  }
}

export const upload = multer({
  storage: storage,
  // limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: function (req, file, cb) {
    checkfile(file, cb);
  },
});

// File deleted
export const unlinkFile = (unlinkFiles = []) => {
  // regex for file types
  const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;

  // Read the files by Uploads folder
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

    // Delete all filies or file
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
