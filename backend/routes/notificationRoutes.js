const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.put("/read-all", authMiddleware, markAllNotificationsAsRead);

router.put("/:id/read", authMiddleware, markNotificationAsRead);

router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
