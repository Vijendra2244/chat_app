const { BlackListModel } = require("../models/blacklist.models");
const { UserModel } = require("../models/user.models");

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const passwordValidation =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordMatchedOrNot = passwordValidation.test(password);
    if (!passwordMatchedOrNot) {
      return res.status(401).send({
        status: "fail password",
        msg: "Password must have at least one uppercase character, one number, one special character, and be at least 8 characters long.",
      });
    }
    
    const user = new UserModel({
      name,
      email,
      password,
    });
    await user.save();
    res
      .status(200)
      .send({ status: "success", msg: "User has been created successfully" });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    const findUserWithMail = await UserModel.findOne({ email });

    const passwordValidation = await findUserWithMail.comparePass(password);

    if (!passwordValidation) {
      return res
        .status(401)
        .send({ status: "fail", msg: "Password is incorrect" });
    }

    const access_token = await findUserWithMail.accessToken();
    const refresh_token = await findUserWithMail.refreshToken();

    res.cookie("access_token", access_token, cookiesOption);
    res.cookie("refresh_token", refresh_token, cookiesOption);

    res.status(200).send({
      status: "success",
      msg: "User login successfully",
    });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    const access_token = req.cookies["access_token"];
    const findToken = await BlackListModel.findOne({ access_token });

    if (findToken) {
      return res
        .status(401)
        .send({ status: "all ready", msg: "You are already logged out" });
    }

    const blackListToken = new BlackListModel({ access_token });
    await blackListToken.save();
    res
      .status(200)
      .send({ status: "success", msg: "User logged out successfully" });
  } catch (error) {
    res.status(400).send({ status: "fail", msg: error.message });
  }
};

module.exports = { userLogin, userRegister, userLogout };
