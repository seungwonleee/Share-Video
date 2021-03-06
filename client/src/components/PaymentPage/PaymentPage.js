import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { dbService } from "../../fire_module/fireMain";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { dialogState } from "../../features/dialog/dialogSlice";
import DialogMessage from "../commons/DialogMessage";
//Material UI Imports
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import PaymentIcon from "@material-ui/icons/Payment";
//Material UI dialog Imports
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ControlButton = styled(Button)`
  span {
    font-size: ${(props) => props.theme.fontSizes.small};
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 80vh;

  h1 {
    padding: 2rem;
    font-size: ${(props) => props.theme.fontSizes.titleSize};
  }
`;

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  font: {
    fontSizes: "16px",
  },
  Button: {
    margin: theme.spacing(1),
  },
  fontsize: {
    fontSize: "1.6rem !important",
  },
}));

const PaymentPage = () => {
  const breakPoint = useMediaQuery({
    query: "(min-width:768px)",
  });
  const classes = useStyles();
  let history = useHistory();
  const dispatch = useDispatch();

  const [uid, setUid] = useState("");
  const [buyList, setBuyList] = useState([]);
  const [totalCost, setTotalCost] = useState([]);
  // console.log("buy list ===>", buyList);

  // ???????????? ??? ??????
  const calculateTotalCost = (items) => {
    const costList = items.map((item, index) => {
      return item.cost;
    });
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const total = costList.reduce(reducer, 0);
    setTotalCost(total);
  };

  // ????????????????????? ????????? title???
  const checkItem = (myShoppingBasket) => {
    //?????????????????? ?????????????????? ??????
    const selectionItems = JSON.parse(localStorage.getItem("buy"));

    const result = [];
    myShoppingBasket.map((basketItem, index) => {
      selectionItems.map((selectionItem, index) => {
        if (basketItem.title === selectionItem) {
          result.push(basketItem);
          // console.log(result);
        }
      });
    });
    setBuyList([...result]);
    calculateTotalCost(result);
  };

  const shoppingBasketList = async (uid) => {
    await dbService
      .collection(uid)
      .doc("shoppingBasket")
      .collection(uid)
      .onSnapshot((snapshot) => {
        // console.log("????????? ????????? ?????? ===>", snapshot.docs);
        const myShoppingBasket = snapshot.docs.map((doc, index) => {
          // console.log(doc.data());
          return {
            ...doc.data(),
            id: doc.data().title,
          };
        });
        // console.log("??? ?????? ?????? ===> ", ...myShoppingBasket);
        // setShoppingBasket([...myShoppingBasket]);
        checkItem(myShoppingBasket);
      });
  };

  const getUid = async () => {
    await axios.get("/api/users/auth").then((res) => {
      setUid(res.data.uid);
      shoppingBasketList(res.data.uid);
      // return res.data.uid;
    });
  };

  useEffect(() => {
    getUid();
  }, []);

  //?????? ??? ???????????? DB??? ??????
  const saveBuyList = async () => {
    // firestore DB save
    await buyList.map((item) => {
      try {
        dbService
          .collection(uid)
          .doc("buyList")
          .collection(uid)
          .doc(item.title)
          .set(item);
        // showAddMessage();
      } catch (error) {
        console.log(error);
        alert("?????? ??? ????????? ??????????????????. ????????? ????????? ?????????.");
      }
    });
  };

  //?????? ??? ?????????????????? ??????
  const deleteShoppingList = async () => {
    // firestore DB delete
    await buyList.map((item) => {
      dbService
        .collection(uid)
        .doc("shoppingBasket")
        .collection(uid)
        .doc(item.title)
        .delete()
        .then(() => {
          console.log("?????? ??????!");
        })
        .catch((error) => {
          console.log("?????? ?????? ==> ", error);
          alert("?????? ??? ????????? ??????????????????. ????????? ????????? ?????????.");
        });
    });
  };

  const handlePayment = () => {
    //?????? ??? ???????????? DB??? ??????
    saveBuyList();
    //?????? ??? ?????????????????? ??????
    deleteShoppingList();
    //DB ???????????? ?????? Dialog ??????
    dispatch(
      dialogState({
        dialogState: true,
        message: "?????? ?????? ??? ?????????. ????????? ??????????????????.",
      })
    );
    setTimeout(() => {
      dispatch(
        dialogState({
          dialogState: false,
          message: null,
        })
      );
      //?????? ?????? ???????????? ??????
      history.push("/completepayment");
    }, 1300);
  };

  return (
    <>
      <Container>
        <h1>?????? ?????????</h1>
        {breakPoint ? (
          <div
            style={{
              height: "400px",
              minWidth: "600px",
            }}
          >
            <TableContainer component={Paper} style={{ height: "100%" }}>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>?????? ??????</TableCell>
                    <TableCell>??????</TableCell>
                    <TableCell>??????</TableCell>
                    <TableCell>??????</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {buyList.map((row) => (
                    <TableRow key={row.title}>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.genre}</TableCell>
                      <TableCell>{row.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell> ??????: {buyList.length}???</TableCell>
                    <TableCell> ????????????: {totalCost}???</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div style={{ height: "400px", width: "100%" }}>
            <TableContainer component={Paper} style={{ height: "100%" }}>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>?????? ??????</TableCell>
                    <TableCell>??????</TableCell>
                    <TableCell>??????</TableCell>
                    <TableCell>??????</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {buyList.map((row) => (
                    <TableRow key={row.title}>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.genre}</TableCell>
                      <TableCell>{row.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell> ??????: {buyList.length}???</TableCell>
                    <TableCell> ????????????: {totalCost}???</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        )}
        {/* ?????? ?????? */}
        <ControlButton
          variant="contained"
          className={classes.Button}
          color="secondary"
          startIcon={<PaymentIcon />}
          onClick={handlePayment}
          size="large"
        >
          <span>????????????</span>
        </ControlButton>
      </Container>
      {/* ?????? ????????? dialog */}
      <DialogMessage />
    </>
  );
};

export default PaymentPage;
