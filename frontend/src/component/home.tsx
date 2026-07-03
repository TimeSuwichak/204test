import styled from "styled-components";
import HomeBanner from "#component/home-banner.tsx";

const content = function ()
{
  return <>
    <content.Intro/>
  </>
}
content.Intro = function HomeIntro ()
{
  return <>
  <IntroView>
    <IntroContainer>
      <HomeBanner/>
    </IntroContainer>
  </IntroView>
  </>
}

const IntroView = styled.div`
  width: 100dvw;
  height: 100dvh;
`;
const IntroContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 64px;
`;

export default content;