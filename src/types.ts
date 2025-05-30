import { Document } from "mongoose";

interface IPackageImage {
    url: string;
    public_id: string;
}

export interface IPackage extends Document {
    name: string;
    description: string;
    price: number;
    destination: string;
    image: IPackageImage;
    createdAt: Date;
}

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}
