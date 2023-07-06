const express = require('express');
const { CreateCoupon, getAllCoupons, getACoupon, updateCoupon, deleteCoupon } = require('../controller/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/", authMiddleware ,isAdmin, CreateCoupon);

router.get("/", authMiddleware ,isAdmin, getAllCoupons);

router.get("/:id", authMiddleware ,isAdmin, getACoupon);

router.put("/:id", authMiddleware ,isAdmin, updateCoupon);

router.delete("/:id", authMiddleware ,isAdmin, deleteCoupon);
module.exports = router;

