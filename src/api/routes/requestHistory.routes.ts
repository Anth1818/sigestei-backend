import { Router } from "express";
import {
  getRequestHistoryController,
  getRequestHistoryByTypeController,
  getHistoryByUserController,
} from "../controllers/requestHistory.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @route   GET /api/request-history/:requestId
 * @desc    Get all history for a specific request
 * @access  Private
 */
router.get("/:requestId", getRequestHistoryController);

/**
 * @route   GET /api/request-history/:requestId/type/:changeType
 * @desc    Get history by change type for a specific request
 * @access  Private
 */
router.get("/:requestId/type/:changeType", getRequestHistoryByTypeController);

/**
 * @route   GET /api/request-history/user/:userId
 * @desc    Get all changes made by a specific user
 * @access  Private
 */
router.get("/user/:userId", getHistoryByUserController);

export default router;
