import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkWishlist,
    clearWishlist,
} from "../controller/wishlistController.js";

const wishlistRouter = express.Router();

// All routes require authentication
wishlistRouter.use(isAuth);

wishlistRouter.post("/", addToWishlist);
wishlistRouter.get("/", getWishlist);
wishlistRouter.get("/check/:propertyId", checkWishlist);
wishlistRouter.delete("/:propertyId", removeFromWishlist);
wishlistRouter.delete("/", clearWishlist);

export default wishlistRouter;
