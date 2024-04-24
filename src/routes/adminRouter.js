import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  addAdmin,
  getAdmin,
  loginAdmin,
  changeAdminRole,
  changeAdminPassword,
  changeAdminDetails,
} from "../controllers/mutations/admin.mutation.js";
import {
  getAllAdmin,
  getAdminById,
} from "../controllers/queries/admins.queries.js";

const adminRouter = express.Router();
adminRouter.post("/add-admin", addAdmin);
adminRouter.post("/login-admin", loginAdmin);
adminRouter.get("/get-admin", adminAuth, getAdmin);
adminRouter.get("/get-all-admins", adminAuth, getAllAdmin);
adminRouter.get("/get-admin-by-id", adminAuth, getAdminById);

adminRouter.patch("/change-password", adminAuth, changeAdminPassword);
adminRouter.patch("/change-details", adminAuth, changeAdminDetails);

adminRouter.patch("/change-role", adminAuth, changeAdminRole);

export default adminRouter;
