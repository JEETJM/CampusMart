const Report = require("../models/Report");
const Product = require("../models/Product");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

/* =========================================================
   CREATE REPORT
========================================================= */

const createReport = async (req, res) => {
  try {
    const { type, productId, reportedUserId, reason, description } =
      req.body || {};

    if (!["Product", "User"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report type.",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Report reason is required.",
      });
    }

    if (type === "Product" && !productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    if (type === "User" && !reportedUserId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    /* =====================================================
       PRODUCT VALIDATION
    ===================================================== */

    let product = null;

    if (type === "Product") {
      product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }
    }

    /* =====================================================
       USER VALIDATION
    ===================================================== */

    let reportedUser = null;

    if (type === "User") {
      reportedUser = await User.findById(reportedUserId);

      if (!reportedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (String(reportedUser._id) === String(req.user._id)) {
        return res.status(400).json({
          success: false,
          message: "You cannot report yourself.",
        });
      }
    }

    /* =====================================================
       DUPLICATE ACTIVE REPORT CHECK
    ===================================================== */

    const duplicateQuery = {
      reporter: req.user._id,
      type,
      status: {
        $in: ["Pending", "Under Review"],
      },
    };

    if (type === "Product") {
      duplicateQuery.product = productId;
    }

    if (type === "User") {
      duplicateQuery.reportedUser = reportedUserId;
    }

    const existingReport = await Report.findOne(duplicateQuery);

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You already have an active report for this item.",
      });
    }

    /* =====================================================
       CREATE REPORT
    ===================================================== */

    const report = await Report.create({
      reporter: req.user._id,

      type,

      product: type === "Product" ? productId : null,

      reportedUser: type === "User" ? reportedUserId : null,

      reason,

      description: String(description || "").trim(),

      status: "Pending",

      adminNote: "",
    });

    /* =====================================================
       NOTIFY PRODUCT SELLER
    ===================================================== */

    if (
      type === "Product" &&
      product?.seller &&
      String(product.seller) !== String(req.user._id)
    ) {
      await createNotification({
        user: product.seller,
        type: "security",
        title: "Product reported",
        message:
          "One of your product listings has been reported and may be reviewed by CampusMart.",
        link: "/my-reports",
      });
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
      report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit report.",
    });
  }
};

/* =========================================================
   GET MY REPORTS
========================================================= */

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      reporter: req.user._id,
    })
      .populate("product", "title images price category condition")
      .populate("reportedUser", "name email studentId college isVerified")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Get My Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your reports.",
    });
  }
};

/* =========================================================
   ADMIN - GET ALL REPORTS
========================================================= */

const getAllReports = async (req, res) => {
  try {
    const { status, type, reason, search } = req.query || {};

    const query = {};

    /* =====================================================
       STATUS FILTER
    ===================================================== */

    if (
      status &&
      ["Pending", "Under Review", "Resolved", "Rejected"].includes(status)
    ) {
      query.status = status;
    }

    /* =====================================================
       TYPE FILTER
    ===================================================== */

    if (type && ["Product", "User", "Order", "Message"].includes(type)) {
      query.type = type;
    }

    /* =====================================================
       REASON FILTER
    ===================================================== */

    if (reason) {
      query.reason = reason;
    }

    let reportsQuery = Report.find(query)
      .populate("reporter", "name email studentId college isVerified")
      .populate("reportedUser", "name email studentId college isVerified")
      .populate(
        "product",
        "title images price category condition seller isAvailable",
      )
      .sort({
        createdAt: -1,
      });

    const reports = await reportsQuery;

    /* =====================================================
       SEARCH FILTER
    ===================================================== */

    let filteredReports = reports;

    if (search && String(search).trim()) {
      const keyword = String(search).trim().toLowerCase();

      filteredReports = reports.filter((report) => {
        const title = report.product?.title || "";

        const reporterName = report.reporter?.name || "";

        const reportedUserName = report.reportedUser?.name || "";

        const reportId = String(report._id);

        const text = [
          title,
          reporterName,
          reportedUserName,
          report.reason,
          report.type,
          reportId,
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(keyword);
      });
    }

    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary = {
      total: reports.length,

      pending: reports.filter((item) => item.status === "Pending").length,

      underReview: reports.filter((item) => item.status === "Under Review")
        .length,

      resolved: reports.filter((item) => item.status === "Resolved").length,

      rejected: reports.filter((item) => item.status === "Rejected").length,
    };

    return res.status(200).json({
      success: true,
      count: filteredReports.length,
      reports: filteredReports,
      summary,
    });
  } catch (error) {
    console.error("Get All Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reports.",
    });
  }
};

/* =========================================================
   ADMIN - GET REPORT BY ID
========================================================= */

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reporter", "name email studentId college isVerified location")
      .populate(
        "reportedUser",
        "name email studentId college isVerified location",
      )
      .populate(
        "product",
        "title images price category condition seller isAvailable location description",
      );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Get Report By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch report.",
    });
  }
};

/* =========================================================
   ADMIN - UPDATE REPORT
========================================================= */

const updateReport = async (req, res) => {
  try {
    const { status, adminNote } = req.body || {};

    const allowedStatuses = ["Pending", "Under Review", "Resolved", "Rejected"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status.",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    const previousStatus = report.status;

    if (status) {
      report.status = status;
    }

    if (adminNote !== undefined) {
      report.adminNote = String(adminNote || "").trim();
    }

    await report.save();

    /* =====================================================
       REPORTER NOTIFICATION
    ===================================================== */

    if (status && previousStatus !== status) {
      let title = "Report status updated";

      let message = `Your ${report.type.toLowerCase()} report is now "${status}".`;

      if (status === "Resolved") {
        title = "Report resolved";

        message = "Your report has been reviewed and resolved by CampusMart.";
      }

      if (status === "Rejected") {
        title = "Report reviewed";

        message =
          "Your report has been reviewed by CampusMart and was not accepted.";
      }

      if (status === "Under Review") {
        title = "Report under review";

        message =
          "Your report is now being reviewed by the CampusMart safety team.";
      }

      await createNotification({
        user: report.reporter,
        type: "security",
        title,
        message,
        link: "/my-reports",
      });
    }

    const updatedReport = await Report.findById(report._id)
      .populate("reporter", "name email studentId college isVerified")
      .populate("reportedUser", "name email studentId college isVerified")
      .populate(
        "product",
        "title images price category condition seller isAvailable",
      );

    return res.status(200).json({
      success: true,
      message: "Report updated successfully.",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Update Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update report.",
    });
  }
};

module.exports = {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  updateReport,
};
