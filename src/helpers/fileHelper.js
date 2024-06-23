import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, '../../', 'Uploads');

// Fayllarni saqlash konfiguratsiyasi
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadFolderPath);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
});

function checkfile(file, cb) {
	const filetypes = /jpeg|jpg|png|gif/;
	const exnames = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetypes = filetypes.test(file.mimetype);

	if (exnames && mimetypes) {
		return cb(null, true);
	} else {
		cb('Error: You can only upload image files');
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
export const unlinkFile = (unlinkFiles = []) => {
	const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;

	fs.readdir(uploadFolderPath, (err, files) => {
		if (err) {
			console.error(
				"Upload papkasidagi fayllarni o'qishda xatolik yuz berdi:",
				err
			);
			return;
		}

		const imageFiles = files.filter(
			file => imageExtensions.test(file) && unlinkFiles.includes(file)
		);

		imageFiles.forEach(file => {
			const filePath = path.join(uploadFolderPath, file);

			fs.unlink(filePath, err => {
				if (err) {
					console.error(`${file} faylini o'chirishda xatolik yuz berdi:`, err);
				} else {
					console.log(`${file} muvaffaqiyatli o'chirildi.`);
				}
			});
		});
	});
};
