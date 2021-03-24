import React, { useState } from "react";
import { authService } from "../../fire_module/fireMain";
import { useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
//Material UI 회원가입 Form 관련 Imports
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// Materaul UI 회원가입 Form Design
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const RegisterPage = () => {
  // Materail Ui 디자인에 사용
  const classes = useStyles();

  //redux로 로그인 상태 체크
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // 로그인한 유저는 해당 페이지에 접근하지 못하도록 Redirect
  let history = useHistory();
  if (isLoggedIn) {
    history.push("/");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInput = (event) => {
    switch (event.currentTarget.name) {
      case "email":
        setEmail(event.currentTarget.value);
        break;
      case "password":
        setPassword(event.currentTarget.value);
        break;
      default:
        break;
      // TODO default 설정 어떻게 할지 고려하기
    }
  };

  //회원가입하기 ( 회원가입 성공하면 바로 로그인된다. )
  const handleCreateAccount = async (event) => {
    event.preventDefault();

    await authService
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // 회원가입 및 로그인 성공
        if (user.operationType === "signIn") {
          alert("회원가입을 축하합니다. 환영합니다.");
        }
        // LandingPage로 이동
        history.push("/");
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // firebase auth 오류 처리
        switch (errorCode) {
          case "auth/email-already-in-use":
            alert("이미 사용중인 이메일 입니다.");
            break;
          case "auth/invalid-email":
            alert("유효하지 않은 형태의 이메일 입니다.");
            break;
          case "auth/operation-not-allowed":
            alert("관리자의 인증이 필요합니다.");
            break;
          case "auth/weak-password":
            alert("비밀번호는 6자 이상 입력해야 합니다.");
            break;
        }
      });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Check Charging
          </Typography>
          <Typography>(회원가입)</Typography>
          <form className={classes.form} onSubmit={handleCreateAccount}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="이메일로 이벤트 관련 소식을 받고 싶습니다."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              회원가입
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  이미 계정이 있으신가요? 로그인 하기
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default RegisterPage;