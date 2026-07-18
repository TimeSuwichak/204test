import react        from "react";
import styled       from "styled-components";
import navigation   from "#util/common.navigation.ts";
import testArtwork  from "#asset/image/test.artwork.jpg";

import { useSearchParams } from "react-router";
import { Share2Icon } from "lucide-react";

const content = function Product ()
{
  const [serachParam] = useSearchParams ();
  const id = serachParam.get ("id");

  react.useEffect (() =>
  {
    console.log ("ID", id);
  },
  [id]);

  return <>
    <StyleRoot>
      <content.Main/>
    </StyleRoot>
  </>;
}
content.Main = function ProductMainContent ()
{
  return (
    <StyleMain>
      <StyleArtwork src={testArtwork}/>
      <StyleMainView>
        <header>
          <StyleMainTitle>[ชื่อเกม]</StyleMainTitle>
          <StyleMainTitleSub>[ข้อความย่อย]</StyleMainTitleSub>
        </header>
        <main>
          <StyleMainDesc>
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
          </StyleMainDesc>
          <StyleMainReview>
            <iframe src="https://www.youtube.com/embed/Ux0YNqhaw0I?si=cDRJRNh5VdQ27VLX" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <iframe src="https://www.youtube.com/embed/9W_8_IR51FM?si=ewYauLVedOMaZ1vD" title="YouTube video player"allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </StyleMainReview>
          <StyleMainOption>
            <StyleMainPrice>
              <StyleMainPriceDiscount>99%</StyleMainPriceDiscount>
              <span>9999฿</span>
            </StyleMainPrice>
            <button>เพิ่มลงในตะกร้า</button>
            <button>
              <Share2Icon/>
              <span>แชร์</span>
            </button>
          </StyleMainOption>
        </main>
      </StyleMainView>
    </StyleMain>
  );
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;

const StyleRoot = styled.div`
  margin: 96px 0px 64px 0px;
  display: block;
`;
const StyleMain = styled.div`
  width: 100%;
  height: 100%;
  height: 768px;
  display: flex;
  flex-direction: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 64px;

  @media (max-width: 960px)
  {
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
`;
const StyleArtwork = styled.img`
  display: block;
  width: 550px;
  height: 100%;
  object-fit: cover;

  @media (max-width: 1268px)
  {
    width: 412px;
    height: 75%;
  }
  @media (max-width: 1024px)
  {
    width: 275px;
    height: 50%;
  }
`;
const StyleMainView = styled.div`
  width: 40%;
  height: auto;

  @media (max-width: 960px)
  {
    width: 100%;
    padding: 0px 96px;
  }
  @media (max-width: 768px)
  {
    width: 100%;
    padding: 0px 64px;
  }
  @media (max-width: 680px)
  {
    width: 100%;
    padding: 0px 16px;
  }
`;
const StyleMainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: normal;
`;
const StyleMainTitleSub = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 32px;
`;
const StyleMainDesc = styled.p`
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 32px;
`;
const StyleMainReview = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 256px;
  margin-bottom: 32px;
  gap: 16px;

  & > iframe
  {
    width: 100%;
    height: 100%;
    max-width: 480px;
    max-height: 256px;
  }
`;
const StyleMainOption = styled.div`
  display: inline-flex;
  width: 100%;
  height: 40px;
  align-items: center;
  gap: 16px;

  & > button
  {
    width: 160px;
  }
  & > button > img,
  & > button > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;
const StyleMainPrice = styled.label`
  display: block;
  position: relative;
  font-size: 1.5rem;
  width: 128px;
`;
const StyleMainPriceDiscount = styled.label`
  font-size: 1.25rem;
  position: absolute;
  inset: auto 16px -32px auto;
  background-color: #FF7373;
  border-radius: 16px;
  padding: 0px 16px;
`;