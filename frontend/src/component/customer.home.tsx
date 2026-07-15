import react from "react";
import styled from "styled-components";
import navigatior from "#util/common.navigation.ts";
import testBanner from "#asset/image/home.testImage2.jpg"
import testArtwork from "#asset/image/test.artwork.jpg";

import Scroll from "#component/scroll.infinite.tsx";
import
{
  ShoppingCartIcon
}
from "lucide-react"

/**
 * ส่วนประกอบแสดงผลสำหรับหน้าแรก
*/
const content = function Home ()
{
  return (<></>);
}
/**
 * ส่วนประกอบแสดงผลสำหรับส่วนเปิด
*/
content.Opening = function HomeOpening ()
{
  return (
    <Opening>
      <OpeningContainer>
        <OpeningBanner>
          <OpeningBannerImg src={testBanner}/>
          <OpeningBannerView>
            <h1>สวัสดีชาวออกซิเจน</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nam eget lacus ultricies, finibus libero nec, mattis lorem. 
              Nunc nec felis consectetur, lacinia risus vulputate, 
              fringilla est.
            </p>
          </OpeningBannerView>
        </OpeningBanner>
      </OpeningContainer>
    </Opening>
  );
}
/**
 * ส่วนประกอบแสดงผลสำหรับส่วนแนะนำ
*/
content.Recommendation = function HomeRecommendation ()
{
  return (
    <Rec>
      <RecImg src={testArtwork}/>
      <RecBody>
        <RecTitle>ที่เราแนะนำในวันนี้: ชื่อเกม</RecTitle>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Nam eget lacus 
          ultricies, finibus libero nec, mattis lorem. Nunc nec felis 
          consectetur, lacinia risus vulputate, fringilla est. In hac habitasse 
          platea dictumst. Sed a lectus non magna scelerisque mattis. Etiam 
          laoreet id nulla et tristique. Nunc vehicula justo maximus erat 
          lacinia, in pharetra massa sagittis. Phasellus id posuere velit, non 
          vehicula odio. Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. 
          Praesent at elit lacinia, tincidunt quam a, faucibus nibh. Cras lacus 
          felis, ultrices ac bibendum a, semper in dui. Proin porttitor 
          metus eu 
          quam tempus blandit. Sed sit amet volutpat leo.

          Class aptent taciti sociosqu ad litora torquent per conubia nostra, 
          per inceptos himenaeos. Sed erat lectus, ullamcorper at lectus eget, 
          dictum imperdiet neque. Nullam a egestas eros. Pellentesque eu ipsum 
          sed libero hendrerit gravida varius ut nulla. Cras vulputate 
          ligula id urna maximus gravida. Fusce lectus nunc, blandit lacinia 
          mauris ac, ultricies porta mi. Aenean dictum massa id mattis interdum.

          Vivamus molestie ac nulla ac commodo. Aliquam erat volutpat. Morbi 
          vitae malesuada elit. Nulla non dolor dolor. Aliquam suscipit metus 
          quis ligula varius, in molestie felis sollicitudin. 
        </p>
      </RecBody>
    </Rec>
  );
}
/**
 * ส่วนประกอบแสดงผลสำหรับที่คัดสรรมาแล้ว
*/
content.Selected = function HomeSelected ()
{
  return (
    <Selected>
      <SelectedTitle>ทั้งหมดนี้ เราได้คัดสรรมาแล้ว</SelectedTitle>
      <SelectedContainer>
        <EndingArtwork src={testArtwork}/>
        <EndingArtwork src={testArtwork}/>
        <EndingArtwork src={testArtwork}/>
        <EndingArtwork src={testArtwork}/>
      </SelectedContainer>
    </Selected>
  );
}
/**
 * ส่วนประกอบแสดงผลสำหรับเกมโปรด
*/
content.Favorite = function HomeFavorite ()
{
  return (
    <Fav>
      <FavImg src={testArtwork}/>
      <FavBody>
        <FavTitle>สุดโปรด สุดหัวใจ: ชื่อเกม</FavTitle>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Nam eget lacus 
          ultricies, finibus libero nec, mattis lorem. Nunc nec felis 
          consectetur, lacinia risus vulputate, fringilla est. In hac habitasse 
          platea dictumst. Sed a lectus non magna scelerisque mattis. Etiam 
          laoreet id nulla et tristique. Nunc vehicula justo maximus erat 
          lacinia, in pharetra massa sagittis. Phasellus id posuere velit, non 
          vehicula odio. Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. 
          Praesent at elit lacinia, tincidunt quam a, faucibus nibh. Cras lacus 
          felis, ultrices ac bibendum a, semper in dui. Proin porttitor 
          metus eu 
          quam tempus blandit. Sed sit amet volutpat leo.

          Class aptent taciti sociosqu ad litora torquent per conubia nostra, 
          per inceptos himenaeos. Sed erat lectus, ullamcorper at lectus eget, 
          dictum imperdiet neque. Nullam a egestas eros. Pellentesque eu ipsum 
          sed libero hendrerit gravida varius ut nulla. Cras vulputate 
          ligula id urna maximus gravida. Fusce lectus nunc, blandit lacinia 
          mauris ac, ultricies porta mi. Aenean dictum massa id mattis interdum.

          Vivamus molestie ac nulla ac commodo. Aliquam erat volutpat. Morbi 
          vitae malesuada elit. Nulla non dolor dolor. Aliquam suscipit metus 
          quis ligula varius, in molestie felis sollicitudin. 
          </p>
      </FavBody>
    </Fav>
  );
}
content.Ending = function HomeEnding ()
{
  function onContinue (event: react.MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    void navigatior.toProductBrowser ();
  }
  return <Ending>
    <Scroll.Infinite
      display="flex"
      displayDirection="row"
      displayGap="16px"
      translateX={2}
      width="100%"
      margin="0px 0px 32px 0px"
    >
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
     <EndingArtwork src={testArtwork}/>
    </Scroll.Infinite>
    <EndingTitle>และยังไม่จบเพียงแค่เท่านี้</EndingTitle>
    <EndingText>
      ยังมีเกมอีก 280 กำลังรอคุณอยู่ให้คุณสัมผัส
    </EndingText>
    <EndingButton onClick={onContinue}>
      <ShoppingCartIcon/>
      เลือกเกมเลย
    </EndingButton>
  </Ending>;
}
const Opening = styled.div`
  height: 95dvh;
`;
const OpeningContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 64px 128px 0px 128px;

  @media (max-width: 1268px)
  {
    padding-left: 32px;
    padding-right: 32px;
  }
  @media (max-width: 1024px)
  {
    padding-left: 16px;
    padding-right: 16px;
  }
`;
const OpeningBanner = styled.div`
  width: 100%;
  height: 100%;
  outline: var(--bg-primary-border) solid 0px;
  border-radius: 8px;
  background-color: #282828;
  position: relative;
  transition: all 66ms cubic-bezier(0.16, 1, 0.3, 1);

  &:hover, &:focus
  {
    outline-width: 0px;
  }
  &:active
  {
    outline-width: 4px;
  }
`;
const OpeningBannerImg = styled.img`
  display: block;
  position: absolute;
  inset: 0px;
  border-radius: 8px;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;
const OpeningBannerView = styled.div`
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

  & > h1
  {
    color: #9ad3cb;
    font-size: 2.5rem;
    text-shadow: 2px 2px 0px #000000;

    width: 40%;
  }
  & > p
  {
    color: #ffffff;
    font-size: 1.5rem;
    text-shadow: 2px 2px 0px #000000;

    width: 40%;
  }

  @media (max-width: 1024px)
  {
    & > h1 { width: 100%; }
    & > p { width: 100%; }
  }
  @media (max-width: 768px)
  {
    padding: 32px;
  }
  @media (max-width: 640px)
  {
    padding: 16px;
  }
`;

const Rec = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 64px;
  width: 100%;
  padding: 32px 256px;
  overflow: hidden;

  @media (max-width: 1600px)
  {
    padding: 32px 128px;
  }
  @media (max-width: 1400px)
  {
    padding: 32px 64px;
  }
  @media (max-width: 1268px)
  {
    padding: 32px 32px;
  }
  @media (max-width: 1268px)
  {
    padding: 32px 16px;
  }
  @media (max-width: 768px)
  {
    flex-direction: column;
    align-items: center;
    padding: 32px 16px;
  }
`;
const RecImg = styled.img`

  object-fit: cover;

  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 800px;

  @media (max-width: 1024px)
  {
    width: 100%;
    height: 100%;
    max-width: 300px;
    max-height: 600px;
  }
`;
const RecBody = styled.div`
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 16px;
  flex-grow: 1;
`;
const RecTitle = styled.h2`
  display: block;
  font-size: 2.5rem;
  font-weight: normal;
  padding: 0px 0px 16px 0px;
`;

const Fav = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  gap: 64px;
  width: 100%;
  padding: 0px 256px;

  @media (max-width: 1600px)
  {
    padding: 32px 128px;
  }
  @media (max-width: 1400px)
  {
    padding: 32px 64px;
  }
  @media (max-width: 1268px)
  {
    padding: 32px 32px;
  }
  @media (max-width: 1268px)
  {
    padding: 32px 16px;
  }
  @media (max-width: 768px)
  {
    flex-direction: column;
    align-items: center;
    padding: 32px 16px;
  }
`;
const FavImg = styled.img`

  object-fit: cover;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 800px;

  @media (max-width: 1024px)
  {
    width: 100%;
    height: 100%;
    max-width: 300px;
    max-height: 600px;
  }
`;
const FavBody = styled.div`
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 16px;
  flex-grow: 1;
`;
const FavTitle = styled.h2`
  display: block;
  font-size: 2.5rem;
  font-weight: normal;
  padding: 0px 0px 16px 0px;
`;

const Selected = styled.div`

  width: 100%;
  padding: 32px 256px;
  overflow: hidden;

  @media (max-width: 1600px)
  {
    padding: 32px 128px;
  }
  @media (max-width: 1400px)
  {
    padding: 32px 64px;
  }
  @media (max-width: 1268px)
  {
    padding: 32px 32px;
  }
  @media (max-width: 1268px)
  {
    padding: 32px 16px;
  }
`;
const SelectedTitle = styled.h2`
  margin: 32px 16px 32px 16px;
  display: block;
  font-size: 2.5rem;
  font-weight: normal;
  text-align: center;
`;
const SelectedContainer = styled.div`
  margin: 32px 16px 32px 16px;
  width: 100%;
  height: 640px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Ending = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
`;
const EndingTitle = styled.h2`
  display: block;
  font-size: 2rem;
  font-weight: normal;
  margin: 16px 16px;
`;
const EndingText = styled.p`
  display: block;
  font-size: 1rem;
  font-weight: normal;
  margin: 0px 16px 32px 16px;
`;
const EndingButton = styled.button`
  width: 160px;
  height: 40px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;
const EndingArtwork = styled.img`
  display: block;

  object-fit: cover;
  width: 100%;
  height: 100%;
  max-width: 200px;
  max-height: 500px;
`;

export default content;