const mongoose = require("mongoose");
const UserSchema = require("./UserSchema");
const WordSchema = require("./WordSchema");
const NewsSchema = require("./NewsSchema");

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://dydgjsfk:VhGbn8WiAz3ykCq3@antmovement.ttziiu6.mongodb.net/",
      {
        dbName: "AntMovement", // 실제로 데이터 저장할 db명
      }
    )
    .then(() => {
      console.log("connect complete!");

      const newUser = new UserSchema({
        user_id: "abbbba",
        user_password: "1234",
      });

      // 데이터 저장
      newUser
        .save()
        .then(() => {
          console.log("User data saved successfully");
        })
        .catch((err) => {
          console.error("Error saving user data:", err);
        });
    })
    .catch((err) => {
      console.error("error > ", err);
    });
};

// 몽구스 커넥션에 이벤트 리스너를 달게 해준다. 에러 발생 시 에러 내용을 기록하고, 연결 종료 시 재연결을 시도한다.
mongoose.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect(); // 연결 재시도
});

module.exports = connect;
