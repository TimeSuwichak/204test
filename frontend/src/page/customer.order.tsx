import { HistoryIcon, BoxIcon } from "lucide-react";
import styled from "styled-components";
import testImg from "#asset/image/test.artwork.jpg";

/**
 * ส่วนประกอบแสดงผลสำหรับหน้าจอเกี่ยวกับประวัติคำสั่งซื้อ
*/
const content = function Order ()
{
  return <content.Root/>;
}
content.Root = function OrderRoot ()
{
  return (
    <StyleRoot>
      <StyleInner>
        <StyleView>
          <StyleViewContainer>
            <StyleTitle>ประวัติคำสั่งซื้อ</StyleTitle>
            <StyleSub>
              <BoxIcon/>
              <span>กำลังดำเนินการ</span>
            </StyleSub>
            <StyleList>
              <content.Item/>
              <content.Item/>
              <content.Item/>
              <content.Item/>
            </StyleList>
            <StyleSub>
              <HistoryIcon/>
              <span>ข้อมูลย้อนหลัง</span>
            </StyleSub>
            <StyleList>
              <content.Item/>
              <content.Item/>
              <content.Item/>
              <content.Item/>
            </StyleList>
          </StyleViewContainer>
        </StyleView>
      </StyleInner>
    </StyleRoot>
  );
}
content.Item = function OrderItem ()
{
  const title = "Battlefield 1 และอีก 3 เกม";
  const status = "กำลังจัดส่ง";
  const date = "01/01/1970";

  return (
    <StyleItem>
      <StyleItemBG src={testImg}/>
      <StyleItemText>
        <span>{title}</span>
        <br/>
        <span>{status}</span>
        <br/>
        <span>{date}</span>
      </StyleItemText>
    </StyleItem>
  );
}

const StyleRoot = styled.div`
  margin: 48px 0px 0px 0px;
`;
const StyleInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const StyleView = styled.div`
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
`;
const StyleViewContainer = styled.div`
  max-width: 1024px;
  width: 100%;
  height: auto;
  padding: 0px 16px;
`;
const StyleTitle = styled.h1`
  font-size: 2rem;
  font-weight: normal;
`;
const StyleSub = styled.h1`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 16px 0px;

  & > img, & > svg
  {
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
    width: 24px;
    height: 24px;
  }
`;
const StyleList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyleItem = styled.button`
  width: 324px;
  height: 256px;
  background-color: var(--bg-primary);
  border: none;
  border-radius: 4px;
  position: relative;
  padding: 0px;
  margin: 0px;
  display: block;

  min-width: 0px;
  min-height: 0px;


  outline: var(--bg-primary-border) solid 0px;
  background-color: transparent;
  transition: outline 66ms cubic-bezier(0.16, 1, 0.3, 1);
  transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
  transition: height 500ms cubic-bezier(0.16, 1, 0.3, 1);

  &:hover, &:focus
  {
    outline-width: 2px;
  }
  &:active
  {
    outline-width: 2px;
  }

  @media (max-width: 1268px)
  {
    width: 288px;
    height: 192px;
  }
  @media (max-width: 920px)
  {
    width: 256px;
    height: 160px;
  }
  @media (max-width: 840px)
  {
    width: 224px;
    height: 128px;
  }
  @media (max-width: 680px)
  {
    width: 100%;
    height: 128px;
  }
`;
const StyleItemBG = styled.img`
  position: absolute;
  inset: 0px;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
  opacity: 0.5;
`;
const StyleItemText = styled.p`
  position: absolute;
  inset: auto 0px 0px 0px;
  display: block;

  font-size: 1rem;
  font-weight: normal;
  padding: 16px;
  text-align: start;
`;

/**
 * ส่งออกตัวแปร
*/
export default content;