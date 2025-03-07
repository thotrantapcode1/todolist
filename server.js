const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const DATA_FILE = path.join(__dirname, "tasks.json");

// Cấu hình EJS & Body-parser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Hàm đọc dữ liệu từ file JSON
const readTasks = () => {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
};

// Hàm ghi dữ liệu vào file JSON
const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
};

// Trang chủ - Hiển thị danh sách công việc
app.get("/", (req, res) => {
  const tasks = readTasks();
  res.render("index.ejs", { tasks });
});

// Thêm công việc
app.post("/add", (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), title: req.body.title, completed: false };
  tasks.push(newTask);
  writeTasks(tasks);
  res.redirect("/");
});

// Đánh dấu hoàn thành công việc
app.post("/complete/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.map(task =>
    task.id == req.params.id ? { ...task, completed: true } : task
  );
  writeTasks(tasks);
  res.redirect("/");
});

// Xóa công việc
app.post("/delete/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(task => task.id != req.params.id);
  writeTasks(tasks);
  res.redirect("/");
});

// Khởi chạy server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
