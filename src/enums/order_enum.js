const STATUS_CREATE = 1;
const STATUS_WAITING = 2;
const STATUS_SUCCESS = 3;
const STATUS_INACTIVE = -1;

const ORDER_STATUS_ENUM = {
  [STATUS_CREATE]: "CREATE",
  [STATUS_WAITING]: "WAITING",
  [STATUS_SUCCESS]: "SUCCESS",
  [STATUS_INACTIVE]: "INACTIVE",
};
const getStatusName = (status) => {
  return ORDER_STATUS_ENUM[status] || "Unknown";
};

export default {
  STATUS_CREATE,
  STATUS_WAITING,
  STATUS_SUCCESS,
  getStatusName,
  STATUS_INACTIVE,
};
