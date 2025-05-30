import { model, Schema } from "mongoose";
import type { IPackage } from "../types";

const packageSchema = new Schema<IPackage>(
    {
        name: {
            type: String,
            required: [true, "Package name is required"],
            trim: true,
            maxlength: [100, "Package name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be at least 0"],
        },
        destination: {
            type: String,
            required: [true, "Destination is required"],
            trim: true,
        },
        image: {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

export default model<IPackage>("Package", packageSchema);
