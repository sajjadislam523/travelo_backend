import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary";
import Package from "../models/Package";

const uploadImage = async (
    file: Express.Multer.File
): Promise<{ url: string; public_id: string }> => {
    if (!file.buffer) {
        throw new Error("No file buffer provided");
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "travel-packages", resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(
                        new Error("Failed to upload image to cloud storage")
                    );
                    return;
                }
                if (!result) {
                    reject(new Error("Upload result is undefined"));
                    return;
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );
        stream.end(file.buffer);
    });
};

// Create new package
export const createPackage: RequestHandler = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "Image file is required" });
        return;
    }

    try {
        const uploadedImage = await uploadImage(req.file);

        if (!uploadedImage || !uploadedImage.url) {
            throw new Error("Image upload failed");
        }

        const newPackage = await Package.create({
            ...req.body,
            image: {
                url: uploadedImage.url,
                public_id: uploadedImage.public_id,
            },
        });
        res.status(201).json({
            success: true,
            data: newPackage,
        });
    } catch (error) {
        console.error("Create package error:", error);
        res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create package",
        });
    }
});

// Get all the packages
export const getAllPackages: RequestHandler = asyncHandler(async (req, res) => {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
});

// Delete a Package
export const deletePackage: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const pkg = await Package.findById(id);
    if (!pkg) {
        res.status(404).json({ message: "Package not found" });
        return;
    }

    try {
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(pkg.image.public_id);

        // Delete form the database
        await Package.findByIdAndDelete(id);

        res.json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error("Delete package error:", error);
        res.status(500).json({ message: "Failed to delete package" });
    }
});

// Get a single package
export const getPackage: RequestHandler = asyncHandler(async (req, res) => {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
        res.status(404).json({ message: "Package not found" });
        return;
    }
    res.json(pkg);
});

// Update package
export const updatePackage: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pkg = await Package.findById(id);

    if (!pkg) {
        res.status(404).json({ message: "Package not found" });
        return;
    }

    let image = pkg.image;
    if (req.file) {
        // Delete old Image
        await cloudinary.uploader.destroy(pkg.image.public_id);

        // Upload new image
        image = {
            url: (await uploadImage(req.file)).url,
            public_id: (await uploadImage(req.file)).public_id,
        };
    }

    const updatedPackage = await Package.findByIdAndUpdate(
        id,
        { ...req.body, image },
        { new: true, runValidators: true }
    );
    res.json(updatedPackage);
});
