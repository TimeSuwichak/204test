import styled from "styled-components";
import testImg from "#asset/image/home.testImage.jpg"

const content = function HomeBanner ()
{
  return <>
  <Root>
    <RootImg src={testImg}/>
    <View>
      <h1>สวัสดีชาวออกซิเจน</h1>
      <p>เวอร์เซิร์ฟเวอร์ 00:00:00</p>
    </View>
  </Root>
  </>;
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: yellow;
  position: relative;
`;
const RootImg = styled.img`
  display: block;
  position: absolute;
  inset: 0px;
  border-radius: 8px;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;
const View = styled.div`
  width: 100%;
  height: 100%;
  inset: 0px;
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: start;
  justify-content: center;
  padding: 64px;

  h1
  {
    color: red;
    font-size: 2.5rem;
  }
  p
  {
    color: red;
    font-size: 1.5rem;
  }
`;

export default content;