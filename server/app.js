const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const shortid = require("shortid");
app.use(cors());
app.use(bodyParser.json());
const razorpay = new Razorpay({
  key_id: "rzp_test_ab44ieJwAQxgEL",
  key_secret: "hgNtenuchVUj1SyApc7rAfQj",
});

app.post("/verify", (req, res) => {
  const SECRET = "balajiprince";
  console.log(req.body);
  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  console.log(digest, req.headers["x-razorpay-signature"]);
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Accepted");
  } else {
    res.status(422);
  }
  res.json({ status: "Ok" });
});
app.post("/pay", async (req, res) => {
  const payment_capture = 1;
  const amount = 70000;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});
app.listen("8000", () => {
  console.log("App is running at 8000");
});
