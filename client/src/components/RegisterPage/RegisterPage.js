import React, { useState } from "react";
import { authService } from "../../fire_module/fireMain";
import { useDispatch } from "react-redux";
import { loginState, setUid } from "../../features/auth/authSlice";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
//회원가입 Form Material UI Imports
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
    backgroundColor: "#A5292A",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  textField: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "light-gray",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#A5292A",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#A5292A",
    },
    "& .MuiOutlinedInput-input": {
      color: "black",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "gray",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "black",
    },
    "& .MuiInputLabel-outlined": {
      color: "gray",
    },
    "&:hover .MuiInputLabel-outlined": {
      color: "gray",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "gray",
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: "#A5292A",
    "&:hover": {
      background: "#822626",
    },
  },
  title: {
    fontSize: "3.4rem",
  },
  text: {
    fontSize: "1.6rem",
  },
  titleLink: {
    color: "black",
  },
}));

const RegisterPage = () => {
  // Materail Ui 디자인에 사용
  const classes = useStyles();

  let history = useHistory();
  const dispatch = useDispatch();

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
    }
  };

  //회원가입하기 ( 회원가입에 성공하면 바로 로그인 된다. )
  const handleCreateAccount = async (event) => {
    event.preventDefault();

    await authService
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // console.log("회원가입", user.user.uid);

        let body = {
          uid: user.user.uid,
          email,
        };

        //회원가입시 uid mongoDB에 저장
        axios
          .post("/api/users/register", body)
          .then((response) => {
            if (response.data.success) {
              // 회원가입과 동시에 로그인 되기때문에 바로 login token 생성
              axios
                .post("/api/users/login", body)
                .then((response) => {
                  if (response.data.loginSuccess) {
                    alert("회원가입을 축하합니다. 환영합니다.");
                  }
                  dispatch(loginState(response.data.loginSuccess));
                  dispatch(setUid(response.data.userUid));
                })
                .catch((error) => console.log(error));
            }
          })
          .catch((error) => console.log(error));

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
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Link to="/" className={classes.titleLink}>
            <Typography component="h1" variant="h5" className={classes.title}>
              Share-Video
            </Typography>
          </Link>
          <Typography className={classes.text}>(회원가입)</Typography>
          <form className={classes.form} onSubmit={handleCreateAccount}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  type="email"
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
                  inputProps={{ className: classes.text }} // font size of input text
                  InputLabelProps={{ className: classes.text }} // font size of input label
                  className={classes.textField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleInput}
                  inputProps={{ className: classes.text }} // font size of input text
                  InputLabelProps={{ className: classes.text }} // font size of input label
                  className={classes.textField}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      color="default"
                      style={{ transform: "scale(1.5)", paddingLeft: "1.5rem" }}
                    />
                  }
                  label={
                    <span style={{ fontSize: "1.4rem" }}>
                      이메일로 이벤트 관련 소식을 받고 싶습니다.
                    </span>
                  }
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
              <span className={classes.text}>회원가입</span>
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/login" variant="body2" className={classes.text}>
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
