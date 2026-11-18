import request from "../utils/request";

//注册
export function registerAccount(data) {
  return request.post("/auth/register", data);
}

//登陆
export function loginAccount(data) {
  return request.post("/auth/login", data);
}

//获取当前用户
export function getCurrentUser() {
  return request.get("/auth/me");
}
