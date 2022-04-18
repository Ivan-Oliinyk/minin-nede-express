module.exports = {
  BASE: "/",

  COURESE: "/courses",
  COURSE_ADD: "/add",
  COURSE_EDIT: "/:id/edit",
  COURSE_REMOVE: "/remove",
  COURSE_EDIT_POST: "/edit",
  COURSE_ONE: "/:id",

  CARD: "/card",
  CARD_ADD: "/add",
  CARD_REMOVE: "/remove/:id",

  ORDER: "/order",

  AUTH: "/auth",
  AUTH_LOGIN: "/login",
  AUTH_LOGIN_REDIRECT: "/auth/login#login",
  AUTH_LOGOUT: "/logout",
  AUTH_REGISTER: "/register",
  AUTH_REGISTER_REDIRECT: "/auth/login#register",
  AUTH_RESET_PASSWORD: "/reset",
  AUTH_RESET_PASSWORD_TOKEN: "/password/:token",
  AUTH_RESET_PASSWORD_REDIRECT: "/auth/password",
  AUTH_RESET_REDIRECT: "/auth/reset",
  AUTH_PASSWORD: "/password",
  AUTH_PASSWORD_REDIRECT: "/auth/password/",

  PROFILE: "/profile",
};
