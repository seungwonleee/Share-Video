import React, { useState } from "react";
import styled from "styled-components";
//Material UI Components
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
//Import MyPage Navigation
import LikePage from "./Sections/LikePage";
import ShoppingBasketPage from "./Sections/ShoppingBasketPage";
import PurchaseHistoryPage from "./Sections/PurchaseHistoryPage";
import MyIndividualWorkPage from "./Sections/MyIndividualWorkPage";

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

  nav {
    margin: 1rem;
  }
`;
const NavButton = styled(Button)`
  span {
    font-size: ${(props) => props.theme.fontSizes.small};
  }
`;

const MyPage = () => {
  const [visible, setVisible] = useState({
    likeVisible: true,
    shoppingBasketVisible: false,
    purchaseHistoryVisible: false,
    myIndividualWorkVisible: false,
  });
  // console.log(" visible 상태 ====> ", visible);

  const handleVisible = (event) => {
    console.log(event.currentTarget.name);
    switch (event.currentTarget.name) {
      case "like":
        setVisible({
          likeVisible: true,
          shoppingBasketVisible: false,
          purchaseHistoryVisible: false,
          myIndividualWorkVisible: false,
        });
        break;
      case "shoppingBasket":
        setVisible({
          likeVisible: false,
          shoppingBasketVisible: true,
          purchaseHistoryVisible: false,
          myIndividualWorkVisible: false,
        });
        break;
      case "purchaseHistory":
        setVisible({
          likeVisible: false,
          shoppingBasketVisible: false,
          purchaseHistoryVisible: true,
          myIndividualWorkVisible: false,
        });
        break;
      case "myIndividualWork":
        setVisible({
          likeVisible: false,
          shoppingBasketVisible: false,
          purchaseHistoryVisible: false,
          myIndividualWorkVisible: true,
        });
        break;
    }
  };

  return (
    <Container>
      <h1>내 정보</h1>

      {/* 목록 카테고리 */}
      <nav>
        <ButtonGroup
          size="large"
          aria-label="large outlined primary button group"
        >
          <NavButton name="like" onClick={handleVisible}>
            <span>좋아요 목록</span>
          </NavButton>
          <NavButton name="shoppingBasket" onClick={handleVisible}>
            <span>장바구니</span>
          </NavButton>
          <NavButton name="purchaseHistory" onClick={handleVisible}>
            <span>구매내역</span>
          </NavButton>
          <NavButton name="myIndividualWork" onClick={handleVisible}>
            <span>내 작품</span>
          </NavButton>
        </ButtonGroup>
      </nav>

      {/* 데이터 테이블 */}
      {visible.likeVisible && <LikePage />}
      {visible.shoppingBasketVisible && <ShoppingBasketPage />}
      {visible.purchaseHistoryVisible && <PurchaseHistoryPage />}
      {visible.myIndividualWorkVisible && <MyIndividualWorkPage />}
    </Container>
  );
};

export default MyPage;
