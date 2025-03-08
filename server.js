const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const USERS_FILE = path.join(__dirname, "data", "users.json");
const TASKS_FILE = path.join(__dirname, "data", "tasks.json");

// Cấu hình EJS & Body-parser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Cấu hình session
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Hàm đọc & ghi file JSON
const readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeFile = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

// Middleware kiểm tra đăng nhập
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// Trang chủ - Hiển thị danh sách công việc (chỉ user đã đăng nhập)
app.get("/", requireLogin, (req, res) => {
  const tasks = readFile(TASKS_FILE).filter(
    task => task.user === req.session.user.username
  );

  const page = parseInt(req.query.page) || 1; // Trang hiện tại
  const perPage = 3; // Số task mỗi trang
  const totalTasks = tasks.length;
  const totalPages = Math.ceil(totalTasks / perPage) || 1;

  // Lấy danh sách task thuộc trang hiện tại
  const paginatedTasks = tasks.slice((page - 1) * perPage, page * perPage);

  res.render("index", { tasks: paginatedTasks, page, totalPages, user: req.session.user });
});


// Trang đăng ký
app.get("/register", (req, res) => {
  res.render("register");
});

// Xử lý đăng ký
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  let users = readFile(USERS_FILE);

  // Kiểm tra user đã tồn tại chưa
  if (users.find((user) => user.username === username)) {
    return res.send("Username đã tồn tại!");
  }

  // Mã hóa mật khẩu
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  writeFile(USERS_FILE, users);

  res.redirect("/login");
});

// Trang đăng nhập
app.get("/login", (req, res) => {
  res.render("login");
});

// Xử lý đăng nhập
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readFile(USERS_FILE);
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.send("Sai tài khoản hoặc mật khẩu!");
  }
  if (user.banned) {
    return res.render("banned");
}

  
  req.session.user = { username: user.username, role: user.role };
  res.redirect(user.role === "admin" ? "/admin" : "/");
});


// Xử lý đăng xuất
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Thêm công việc (chỉ user đã đăng nhập)
app.post("/add", requireLogin, (req, res) => {
  const tasks = readFile(TASKS_FILE);
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
    user: req.session.user.username
  };
  tasks.push(newTask);
  writeFile(TASKS_FILE, tasks);
  res.redirect("/");
});

// Đánh dấu hoàn thành công việc
app.post("/complete/:id", requireLogin, (req, res) => {
  let tasks = readFile(TASKS_FILE);
  tasks = tasks.map(task =>
    task.id == req.params.id && task.user === req.session.user.username
      ? { ...task, completed: true }
      : task
  );
  writeFile(TASKS_FILE, tasks);
  res.redirect("/");
});

// Xóa công việc
app.post("/delete/:id", requireLogin, (req, res) => {
  let tasks = readFile(TASKS_FILE);
  tasks = tasks.filter(task => task.id != req.params.id || task.user !== req.session.user.username);
  writeFile(TASKS_FILE, tasks);
  res.redirect("/");
});

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.send("Bạn không có quyền truy cập!");
  }
  next();
};

app.get("/admin", requireAdmin, (req, res) => {
  const users = readFile(USERS_FILE);
  const tasks = readFile(TASKS_FILE);
  res.render("admin", { users, tasks, admin: req.session.user });
});

app.post("/admin/delete-task/:id", requireAdmin, (req, res) => {
  let tasks = readFile(TASKS_FILE);
  tasks = tasks.filter(task => task.id != req.params.id);
  writeFile(TASKS_FILE, tasks);
  res.redirect("/admin");
});

app.post("/admin/toggle-ban/:username", requireAdmin, (req, res) => {
  let users = readFile(USERS_FILE);
  users = users.map(user => 
    user.username === req.params.username ? { ...user, banned: !user.banned } : user
  );
  writeFile(USERS_FILE, users);
  res.redirect("/admin");
});


// Khởi chạy server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
