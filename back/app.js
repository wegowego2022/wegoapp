// **절대 실무용으로 사용하지 마세요. 강좌를 위한 백엔드 더미 구현입니다.** //


const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const SocketIO = require("socket.io");
const shortid = require("shortid");
const multer = require("multer");
const admin = require("firebase-admin");
const cors = require('cors');
let phoneToken;
// process.env.GOOGLE_APPLICATION_CREDENTIALS =
//   "./fooddeliveryapp-6609a-firebase-adminsdk-nev9a-603a8b9ae6.json";
//
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "https://fooddeliveryapp-6609a.firebaseio.com",
// });
const orders = [];
const app = express();
app.use(cors());
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwtSecret = "JWT_SECRET";
const users = {};

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }
  try {
    const data = jwt.verify(
      req.headers.authorization.replace("Bearer ", ""),
      jwtSecret
    );
    res.locals.email = data.email;
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(419)
        .json({ message: "만료된 액세스 토큰입니다.", code: "expired" });
    }
    return res
      .status(401)
      .json({ message: "유효하지 않은 액세스 토큰입니다." });
  }
  next();
};

const verifyRefreshToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }
  try {
    const data = jwt.verify(
      req.headers.authorization.replace("Bearer ", ""),
      jwtSecret
    );
    res.locals.email = data.email;
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(419)
        .json({ message: "만료된 리프레시 토큰입니다.", code: "expired" });
    }
    return res
      .status(401)
      .json({ message: "유효하지 않은 리프레시 토큰입니다." });
  }
  next();
};

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
// "complete" 엔드포인트에 POST 요청을 처리하는 핸들러 함수
// app.post("/complete", upload.single('image'), (req, res) => {
//   const { findName, findSeries, findEpisode, findHour, findMinute, findSecond, findText } = req.body;

//   const image = req.file;

//   const filePath = path.join(__dirname, "uploads", image.filename);

//   fs.rename(image.path, filePath, (error) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ message: "파일 업로드에 실패했습니다." });
//     }

//     const newFindData = {
//       id: shortid.generate(),
//       findName,
//       findSeries,
//       findEpisode,
//       findHour,
//       findMinute,
//       findSecond,
//       findText,
//       image: image.filename,
//     };

//     find.push(newFindData);
//     res.json({ findData: find });
//   });
// });


// write
app.post("/complete", (req, res, next) => {
  const find = {};
  const { findName, findSeries, findEpisode, findHour, findMinute, findSecond, findText } = req.body;

  find[findName] = {
    findName,
    findSeries,
    findEpisode,
    findHour,
    findMinute,
    findSecond,
    findText,
  };

  return res.json({
    data: {
      findName,
      findSeries,
      findEpisode,
      findHour,
      findMinute,
      findSecond,
      findText,
    },
  });
});


// Find데이터 받기 끝


app.get("/", (req, res) => {
  res.send("ok");
});
app.post("/api/refreshToken", verifyRefreshToken, (req, res, next) => {
  const accessToken = jwt.sign(
    { sub: "access", email: res.locals.email },
    jwtSecret,
    { expiresIn: "5m" }
  );
  if (!users[res.locals.email]) {
    return res.status(404).json({ message: "가입되지 않은 회원입니다." });
  }
  res.json({
    data: {
      accessToken,
      email: res.locals.email,
      name: users[res.locals.email].name,
    },
  });
});

app.post("/users/signup", (req, res, next) => {
  if (users[req.body.email]) {
    return res.status(401).json({ message: "이미 가입한 회원입니다." });
  }
  users[req.body.email] = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    name: req.body.name,
  };

  return res.json({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  });
});

app.post("/users/signin", (req, res, next) => {
  if (!users[req.body.email]) {
    return res.status(401).json({ message: "가입하지 않은 회원입니다." });
  }
  if (req.body.password !== users[req.body.email].password) {
    return res.status(401).json({ message: "잘못된 비밀번호입니다." });
  }
  const refreshToken = jwt.sign(
    { sub: "refresh", email: req.body.email },
    jwtSecret,
    { expiresIn: "24h" }
  );
  const accessToken = jwt.sign(
    { sub: "access", email: req.body.email },
    jwtSecret,
    { expiresIn: "5m" }
  );
  users[req.body.email].refreshToken = refreshToken;
  return res.json({
    data: {
      name: users[req.body.email].name,
      email: req.body.email,
      refreshToken,
      accessToken,
    },
  });
});
app.post("/api/users/logout", verifyToken, (req, res, next) => {
  delete users[res.locals.email];
  res.json({ message: "ok" });
});

app.post("/accept", verifyToken, (req, res, next) => {
  const order = orders.find((v) => v.orderId === req.body.orderId);
  if (!order) {
    return res.status(400).json({ message: "유효하지 않은 주문입니다." });
  }
  if (order.rider) {
    return res
      .status(400)
      .json({ message: "다른 사람이 이미 수락한 주문건입니다. " });
  }
  order.rider = res.locals.email;
  console.log(order);
  res.send("ok");
});

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

app.post("/phonetoken", (req, res, next) => {
  phoneToken = req.body.token;
  res.send("ok");
});
app.get("/showmethemoney", verifyToken, (req, res, next) => {
  const order = orders.filter(
    (v) => v.rider === res.locals.email && !!v.completedAt
  );
  res.json({
    data: order.reduce((a, c) => a + c.price, 0) || 0,
  });
});

app.get("/api/completes", verifyToken, (req, res, next) => {
  const order = orders.filter(
    (v) => v.rider === res.locals.email && !!v.completedAt
  );
  res.json({
    data: order,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json(err);
});

// 네이버 검색 API 예제 - 영화,드라마 검색
// const client_id = 's6CGlfEGZ2SuWRgraLSw';
// const client_secret = 'jdlGBCi7wZ';
// var axios = require('axios');
// app.post('/search/movie', function (req, res) {
//   console.log(req.body.query);
//   var api_url = 'https://openapi.naver.com/v1/search/movie?query=' + encodeURI(req.body.query); // JSON 결과

//   axios.get(api_url, {
//       headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret },
//     })
//     .then(function (response) {
//       if (response.status === 200) {
//         res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
//         res.end(response);
//         console.log(response);
//       } else {
//         res.status(response.status).end();
//         console.log('error = ' + response.status);
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });


const server = app.listen(3105, () => {
  console.log('Connected.');
});



// websocket
const io = SocketIO(server, {
  path: "/socket.io",
});
app.set("io", io);

io.on("connection", (socket) => {
  let id;
  let orderId;
  console.log(socket.id, "연결되었습니다.");
  socket.on("login", () => {
    if (id) {
      clearInterval(id);
    }
    console.log(socket.id, "로그인했습니다.");
    id = setInterval(() => {
      io.emit("hello", "emit");
    }, 1000);
  });
  socket.on("ignoreOrder", () => {
    if (orderId) {
      clearInterval(orderId);
    }
  });
  socket.on("acceptOrder", () => {
    if (orderId) {
      clearInterval(orderId);
    }
    orderId = setInterval(() => {
      const order = {
        orderId: shortid(),
        start: {
          latitude: Math.floor(Math.random() * 200) * 0.001 + 37.4,
          longitude: Math.floor(Math.random() * 300) * 0.001 + 126.8,
        },
        end: {
          latitude: Math.floor(Math.random() * 200) * 0.001 + 37.4,
          longitude: Math.floor(Math.random() * 300) * 0.001 + 126.8,
        },
        price: Math.floor(Math.random() * 6) * 1000 + 6000,
        rider: Math.random() > 0.5 ? shortid() : undefined,
      };
      orders.push(order);
      io.emit("order", order);
    }, 10_000);
  });
  socket.on("disconnect", () => {
    console.log(socket.id, "연결 끊었습니다..");
    if (id) {
      clearInterval(id);
    }
    if (orderId) {
      clearInterval(orderId);
    }
  });
});




