const mongoose = require("mongoose");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Report = require("../models/Report");

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getAdminDashboard = async (req, res) => {
  try {
    // -----------------------------
    // USER STATS
    // -----------------------------

    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      verifiedUsers,
      activeUsers,
      inactiveUsers,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: { $ne: "admin" },
      }),

      User.countDocuments({
        role: "admin",
      }),

      User.countDocuments({
        isVerified: true,
      }),

      User.countDocuments({
        isActive: true,
      }),

      User.countDocuments({
        isActive: false,
      }),
    ]);

    // -----------------------------
    // PRODUCT STATS
    // -----------------------------

    const [totalProducts, activeProducts, inactiveProducts] = await Promise.all(
      [
        Product.countDocuments(),

        Product.countDocuments({
          isActive: true,
        }),

        Product.countDocuments({
          isActive: false,
        }),
      ],
    );

    // -----------------------------
    // ORDER STATS
    // -----------------------------

    const [totalOrders, completedOrders, pendingOrders, cancelledOrders] =
      await Promise.all([
        Order.countDocuments(),

        Order.countDocuments({
          orderStatus: "Completed",
        }),

        Order.countDocuments({
          orderStatus: {
            $in: ["Placed", "Confirmed", "Ready for Pickup"],
          },
        }),

        Order.countDocuments({
          orderStatus: "Cancelled",
        }),
      ]);

    // -----------------------------
    // REVENUE
    // Paid online orders
    // + completed cash-on-pickup orders
    // -----------------------------

    const revenueResult = await Order.aggregate([
      {
        $match: {
          $or: [
            {
              paymentStatus: "Paid",
            },
            {
              paymentMethod: "Cash on Pickup",
              orderStatus: "Completed",
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$subtotal",
          },
        },
      },
    ]);

    const revenue = revenueResult[0]?.total || 0;

    // -----------------------------
    // REPORT STATS
    // -----------------------------

    const [
      totalReports,
      pendingReports,
      underReviewReports,
      resolvedReports,
      rejectedReports,
    ] = await Promise.all([
      Report.countDocuments(),

      Report.countDocuments({
        status: "Pending",
      }),

      Report.countDocuments({
        status: "Under Review",
      }),

      Report.countDocuments({
        status: "Resolved",
      }),

      Report.countDocuments({
        status: "Rejected",
      }),
    ]);

    // -----------------------------
    // RECENT ORDERS
    // -----------------------------

    const recentOrders = await Order.find()
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // -----------------------------
    // RECENT REPORTS
    // -----------------------------

    const recentReports = await Report.find()
      .populate("reporter", "name email")
      .populate("reportedUser", "name email")
      .populate("product", "title image")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // -----------------------------
    // FINAL RESPONSE
    // -----------------------------

    return res.status(200).json({
      success: true,

      stats: {
        users: {
          total: totalUsers,
          students: totalStudents,
          admins: totalAdmins,
          verified: verifiedUsers,
          active: activeUsers,
          inactive: inactiveUsers,
        },

        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
        },

        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders,
          cancelled: cancelledOrders,
        },

        revenue,

        reports: {
          total: totalReports,
          pending: pendingReports,
          underReview: underReviewReports,
          resolved: resolvedReports,
          rejected: rejectedReports,
        },
      },

      recentOrders,
      recentReports,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard.",
    });
  }
};

// ======================================================
// GET ALL USERS
// ======================================================

const getAllUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "",
      verification = "",
      status = "",
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          studentId: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (verification === "verified") {
      query.isVerified = true;
    }

    if (verification === "unverified") {
      query.isVerified = false;
    }

    if (status === "active") {
      query.isActive = true;
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    const users = await User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .lean();

    const [total, students, admins, verified, active, inactive] =
      await Promise.all([
        User.countDocuments(query),

        User.countDocuments({
          ...query,
          role: { $ne: "admin" },
        }),

        User.countDocuments({
          ...query,
          role: "admin",
        }),

        User.countDocuments({
          ...query,
          isVerified: true,
        }),

        User.countDocuments({
          ...query,
          isActive: true,
        }),

        User.countDocuments({
          ...query,
          isActive: false,
        }),
      ]);

    return res.status(200).json({
      success: true,
      users,
      summary: {
        total,
        students,
        admins,
        verified,
        active,
        inactive,
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

// ======================================================
// GET SINGLE USER
// ======================================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const productCount = await Product.countDocuments({
      seller: id,
    });

    const orderCount = await Order.countDocuments({
      buyer: id,
    });

    return res.status(200).json({
      success: true,
      user,
      stats: {
        productCount,
        orderCount,
      },
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load user.",
    });
  }
};

// ======================================================
// UPDATE USER STATUS
// ======================================================

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own admin account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        isActive ?
          "User activated successfully."
        : "User deactivated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update User Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user status.",
    });
  }
};

// ======================================================
// UPDATE USER VERIFICATION
// ======================================================

const updateUserVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVerified must be true or false.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isVerified = isVerified;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        isVerified ?
          "User verified successfully."
        : "User verification removed.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Update User Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update verification.",
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserVerification,
};
