import react from "react";
import styled from "styled-components";
import navigatior from "#util/common.navigation.ts";
import testImg from "#asset/image/home.testImage.jpg"

import Scroll from "#component/scroll.infinite.tsx";

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
          <OpeningBannerImg src={testImg}/>
          <OpeningBannerView>
            <h1>สวัสดีชาวออกซิเจน</h1>
            <p>เวอร์เซิร์ฟเวอร์ 00:00:00</p>
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
      <RecImg src={undefined}/>
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
content.Favorite = function HomeFavorite ()
{
  return (
    <Fav>
      <FavImg src={undefined}/>
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
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
     <EndingArtwork/>
    </Scroll.Infinite>
    <h2>และยังไม่จบเพียงแค่เท่านี้</h2>
    <p>ยังมีเกมอีก 280 กำลังรอคุณอยู่ให้คุณสัมผัส</p>
    <br/>
    <button onClick={onContinue}>เลือกเกมเลย</button>
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
  border-radius: 8px;
  background-color: yellow;
  position: relative;
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

  h1
  {
    color: #9ad3cb;
    font-size: 2.5rem;
    text-shadow: 2px 2px 0px #000000;
  }
  p
  {
    color: #ffffff;
    font-size: 1.5rem;
    text-shadow: 2px 2px 0px #000000;
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
  min-width: 130mm;
  min-height: 184mm;
  max-width: 130mm;
  max-height: 184mm;

  @media (max-width: 1024px)
  {
    min-width: 65mm;
    min-height: 92mm;
    max-width: 65mm;
    max-height: 92mm;
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
  font-size: 2rem;
  font-weight: bold;
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
  min-width: 130mm;
  min-height: 184mm;
  max-width: 130mm;
  max-height: 184mm;

  @media (max-width: 1024px)
  {
    min-width: 65mm;
    min-height: 92mm;
    max-width: 65mm;
    max-height: 92mm;
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
  font-size: 2rem;
  font-weight: bold;
  padding: 0px 0px 16px 0px;
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
const EndingArtwork = styled.img`
  display: block;
  min-width: 65mm;
  min-height: 92mm;
  max-width: 65mm;
  max-height: 92mm;
`;

export default content;