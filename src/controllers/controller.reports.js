import serverReports from "../services/service.reports.js";
import { dateHelper } from "../helpers/dateHelper.js";

const getAllReports = async (req, res) => {
  const from = req.query.from || Math.floor(Date.now() / 1000) - 84600;
  const to = req.query.to || Math.floor(Date.now() / 1000);

  const result = await serverReports.getUsersReports(
    parseInt(from),
    parseInt(to)
  );

  if (result) {
    return res.status(200).json({
      message: "successfully",
      data: result,
    });
  }
  res.status(404).json({ message: "Error" });
};

const getUserReport = async (req, res) => {
  const from = req.query.from || Math.floor(Date.now() / 1000) - 84600;
  const to = req.query.to || Math.floor(Date.now() / 1000);
  const userNumber = req.query.userNumber;

  const result = await serverReports.getUserReport(
    parseInt(from),
    parseInt(to),
    userNumber
  );

  if (result) {
    return res.status(200).json({
      message: "successfully",
      data: result,
    });
  }
  res.status(404).json({ message: "Error" });
};

const getProductsInCountMaxByOrder = async (req, res) => {
  try {
    const result = await serverReports.getProductsInCountMaxByNewOrder();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getUsersInCountMaxByOrder = async (req, res) => {
  try {
    const result = await serverReports.getUsersNameBySuccessOrder();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default {
  getAllReports,
  getUserReport,
  getProductsInCountMaxByOrder,
  getUsersInCountMaxByOrder,
};
