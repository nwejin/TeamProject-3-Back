const VirtualSchema = require("../models/VirtualSchema");

// profit, win, loss 모두 저장
exports.post_profit = async (req, res) => {
  const { profit } = req.body;
  console.log("req.body > ", profit);

  try {
    const data = await VirtualSchema.findOne({});

    if (data) {
      // profit 없을 시 생성, 있다면 추가
      if (data.profit) {
        data.profit += profit;
      } else {
        data.profit = profit;
      }

      // highest profit 없을 시 생성, 있다면 저장된 값과 들어온 값을 비교 후 큰 것을 저장
      if (data.highest_profit) {
        data.highest_profit = Math.max(data.highest_profit, profit);
      } else {
        data.highest_profit = profit;
      }

      await data.save();

      // 이득이 많다면 win, 손해가 많다면 loss
      if (profit > 0) {
        if (!data.win) {
          // win 필드가 없으면 초기화
          data.win = 0;
        }
        data.win += 1;
      } else {
        if (!data.loss || isNaN(data.loss)) {
          // loss 필드가 없거나 NaN이면 초기화
          data.loss = 0;
        }
        data.loss += 1;
      }

      await data.save(); // 각 필드를 별도로 처리 후 다시 저장

      console.log("profit 업데이트 완료");
    } else {
      // 새로운 데이터 생성
      const newProfit = new VirtualSchema({ profit });
      if (profit >= 0) {
        newProfit.win = 1;
      } else {
        newProfit.loss = 1;
      }
      await newProfit.save();

      console.log("profit 속성이 존재하지 않아서 추가함");
    }
  } catch (error) {
    console.log(error);
  }
};
