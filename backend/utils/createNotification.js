const Notification = require("../models/Notification");

const createNotification = async ({
  user,
  type = "system",
  title,
  message,
  link = "",
}) => {
  try {
    if (!user || !title || !message) {
      return null;
    }

    const notification = await Notification.create({
      user,
      type,
      title,
      message,
      link,
    });

    return notification;
  } catch (error) {
    console.error("Create Notification Error:", error);
    return null;
  }
};

module.exports = createNotification;
