/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse, } from "cloudinary";
import { envVars } from "./env";
import Stream from "stream";
import AppError from "../error/AppError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_SECRET,
});
  
export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> =>{
  try {
    return new Promise((resolve, rejects) =>{
      const public_id = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new Stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: public_id,
          folder: "pdf"
        },
        (error, result) =>{
          if(error){
            return rejects(error);
          }
          resolve(result)
        }
      ).end(buffer)
    })
  } catch (error: any) {
    throw new AppError(401, `Error uploading file ${error.message}`)
  }
};

export const deleteImageFromCloudinary = async (url: string) =>{
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    console.log((match));

  } catch (error: any) {
    throw new AppError(401, `Cloudinary image deletion failed ${error.message}`)
  }
};

export const cloudinaryUpload = cloudinary;