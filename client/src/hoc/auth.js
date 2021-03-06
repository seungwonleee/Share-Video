import React, { useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginState, setUid, setEmail } from "../features/auth/authSlice";

const auth = (SpecificComponent, option) => {
  //option 미입력    =>  아무나 출입이 가능한 페이지
  //true    =>  로그인한 유저만 출입이 가능한 페이지
  //false   =>  로그인한 유저는 출입 불가능한 페이지

  const AuthenticationCheck = () => {
    let history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
      axios.get("/api/users/auth").then((res) => {
        console.log("auth ===> ", res.data);

        //로그인 하지 않은 상태
        if (!res.data.isAuth) {
          if (option) {
            alert("로그인 후 사용 가능합니다.");
            return history.push("/login");
          }
        } else {
          //로그인 한 상태
          if (option === false) {
            history.push("/");
          }
          dispatch(loginState(res.data.isAuth));
          dispatch(setUid(res.data.uid));
          dispatch(setEmail(res.data.email));
        }
      });
    }, []);

    return <SpecificComponent />;
  };
  return AuthenticationCheck;
};

export default auth;
