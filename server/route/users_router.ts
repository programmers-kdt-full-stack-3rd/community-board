import express from "express";
import { registerUser } from "../controller/users_controller";
import { body } from "express-validator";
import { validate } from "../middleware/validate";

// Request body 유효성 검사
const joinValidation = [
  body("email")
    .notEmpty()
    .withMessage("이메일을 입력해주십시오.")
    .bail()
    .isEmail()
    .withMessage("이메일 형식이 아닙니다."),
  body("password")
    .notEmpty()
    .withMessage("비밀번호를 입력해주십시오.")
    .bail()
    .isStrongPassword({
      minLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage("올바른 형태의 비밀번호가 아닙니다."),
  body("nickname").notEmpty().withMessage("닉네임을 입력해주십시오."),
  validate,
];

const router = express.Router();
router.use(express.json());

router.post("/join", joinValidation, registerUser);

export default router;
