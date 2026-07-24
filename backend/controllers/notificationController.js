const Notification = require("../models/Notification");

// @desc Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, notification: notif });
  } catch (error) {
    next(error);
  }
};

// @desc Mark all as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

// @desc Get notifications for logged-in user (any role)
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};
