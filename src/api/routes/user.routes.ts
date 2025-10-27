import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdentityCardController,
  getAllUsersByAllDepartmentsController,
  getAllUsersByDepartmentController,
  registerUserController,
  updateUserController,
  toggleActiveUserController,
  resetUserPasswordController,
  changeUserPasswordController,
} from "../controllers/user.controller";
import authMiddleware from "../../middlewares/authMiddleware";
import roleMiddleware from "../../middlewares/roleMiddleware";

const router = Router();
router.use(authMiddleware);

//Rutas Listas
// GET /api/users
router.get("/", roleMiddleware(1), getAllUsersController);

// GET /api/users/identity_card/:identity_card
router.get(
  "/identity_card/:identity_card",
  roleMiddleware(1,2,3,4),
  getUserByIdentityCardController
);

// get all users by all departments

router.get(
  "/allUsersByAllDepartments",
  roleMiddleware(1),
  getAllUsersByAllDepartmentsController
);

router.get(
  "/allUsersByDepartment/:department_id",
  roleMiddleware(1, 2, 3, 4),
  getAllUsersByDepartmentController
);

// POST /api/users/register
router.post("/register", roleMiddleware(1), registerUserController);

// PUT /api/users/update/:identity_card
router.put("/update/:identity_card", roleMiddleware(1), updateUserController);

// PUT /api/users/toggleActive/:identity_card
router.put(
  "/toggleActive/:identity_card",
  roleMiddleware(1),
  toggleActiveUserController
);

// PUT /api/users/resetPassword/:identity_card
router.put(
  "/resetPassword/:identity_card",
  roleMiddleware(1),
  resetUserPasswordController
);


// PUT /api/users/changePassword/:identity_card
router.put("/changePassword/:identity_card",
roleMiddleware(1, 2, 3, 4),
changeUserPasswordController
);

export default router;
