import cloudinary from "../config/cloudinary.js";
import { Readable } from "node:stream";


// Конвертуємо buffer (від multer) в stream для Cloudinary
const bufferToStream = (buffer)=> {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};

// Конвертуємо buffer (від multer) в stream для Cloudinary
export const uploadToCloudinary = (buffer, folder) =>{
    return new Promise((resolve, reject)=> {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder, 
            resource_type: 'image',
            transformation:[
                {quality: 'auto'},
                {fetch_format: 'auto'}
            ]
        },
    (error, result)=>{
        if(error)reject(error);
        else resolve(result);
    }
    );
    bufferToStream(buffer).pipe(uploadStream);
    });
};

// Видалити файл з Cloudinary по public_id
export const deleteFromCloudinary = async (publicId)=>{
    if(!publicId) return;
    await cloudinary.uploader.destroy(publicId)
};