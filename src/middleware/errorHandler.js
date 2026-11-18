export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: "资源不存在" });
  }
  res.status(500).json({ error: "服务器内部错误" });
}
