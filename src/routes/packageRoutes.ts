import { Router } from "express";
import {
    createPackage,
    deletePackage,
    getAllPackages,
    getPackage,
    updatePackage,
} from "../controllers/packageController";
import upload from "../middlewares/upload";

const router = Router();

// Create Package
router.post("/", upload.single("image"), createPackage);

// Get all the packages
router.get("/", getAllPackages);

// Get single package
router.get("/:id", getPackage);

// Update package
router.put("/:id", upload.single("image"), updatePackage);

// Delete package
router.delete("/:id", deletePackage);

export default router;
