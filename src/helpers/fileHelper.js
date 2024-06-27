import multer from "multer";
import path from "path";
import fs from "fs";
// import AWS from "aws-sdk";
// import multerS3 from "multer-s3";
import { fileURLToPath } from "url";
// import env from "dotenv";
// env.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, "../../", "Uploads");

// Fayllarni saqlash konfiguratsiyasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname
      .trim()
      .replace(/\s+/g, "-")}`;
    cb(null, uniqueSuffix);
  },
});

function checkfile(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: You can only upload image files"));
  }
}

export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Fayl hajmi limiti 100MB
  fileFilter: function (req, file, cb) {
    checkfile(file, cb);
  },
});

// Fayl o'chirish funksiyasi
export const unlinkFile = (array = []) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;

  fs.readdir(uploadFolderPath, (err, files) => {
    if (err) {
      console.error(
        "Upload papkasidagi fayllarni o'qishda xatolik yuz berdi:",
        err
      );
      return;
    }

    const unlinkFiles = array.map((unlinkFile) =>
      unlinkFile.toString().slice(1)
    );

    const imageFiles = files.filter(
      (file) => imageExtensions.test(file) && unlinkFiles.includes(file)
    );

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

// // DigitalOcean Spaces sozlash
// const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
// const s3 = new AWS.S3({
//   endpoint: spacesEndpoint,
//   accessKeyId: process.env.DO_SPACES_KEY,
//   secretAccessKey: process.env.DO_SPACES_SECRET,
// });

// // Multer sozlash
// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "my_access_key_97",
//     acl: "public-read", // Faylni ochiq qilish (yoki private)
//     key: function (req, file, cb) {
//       const fileName = Date.now().toString() + "-" + file.originalname;
//       const folderPath = "uploads/images/"; // Faylni saqlash uchun papka yo'li
//       const fileKey = folderPath + fileName; // Faylning to'liq yo'li (key)
//       cb(null, fileKey); // Keyni qaytarish
//     },
//   }),
// });

// export const unlinkFile = async (unlinkFiles = []) => {
//   const deleteObjects = unlinkFiles.map((file) => ({
//     Key: file,
//   }));

//   const params = {
//     Bucket: "my_access_key_97",
//     Delete: {
//       Objects: deleteObjects,
//       Quiet: false,
//     },
//   };

//   try {
//     const data = await s3.deleteObjects(params).promise();
//     console.log("Fayllar muvaffaqiyatli o'chirildi:", data.Deleted);
//   } catch (err) {
//     console.error("Fayllarni o'chirishda xatolik yuz berdi:", err);
//   }
// };
