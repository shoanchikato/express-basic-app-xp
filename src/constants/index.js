APP_SESSION_COOKIE_NAME = "app.sid";
SERVER_SESSION_DURATION = 60 * 5; // seconds
ACTION = {
  CREATE: "create",
  GETALL: "getall",
  GETONE: "getone",
  EDIT: "edit",
  DELETE: "delete",
  ACTIVATE: "activate",
  DEACTIVATE: "deactivate",
  SUSPEND: "suspend",
  BAN: "ban",
};
PERMISSION_STATUS = {
  ACTIVE: "ACTIVE",
  DEACTIVATE: "DEACTIVATE",
};

module.exports = {
  APP_SESSION_COOKIE_NAME,
  SERVER_SESSION_DURATION,
  ACTION,
  PERMISSION_STATUS,
};
