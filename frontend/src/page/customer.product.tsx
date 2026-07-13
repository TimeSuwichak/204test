import styled from "styled-components";

const content = function Product ()
{
  return <>
    <HeadView>
      <content.HeadImage/>
      <content.HeadIntro/>
    </HeadView>
  </>;
}

content.HeadImage = function ProductHeadImage ()
{
  return <HeadViewContent $width="40%">
    <img src={undefined} width={256} height={256}/>
  </HeadViewContent>;
};
content.HeadIntro = function ProductHeadIntro ()
{
  return <HeadViewContent $width="60%">
    <HeadTitle>[PRODUCT TITLE]</HeadTitle>
    <HeadTitleLabel>
      <label>[PRODUCT VENDOR]</label>
      <label>*</label>
      <label>[PRODUCT PRICE]</label>
    </HeadTitleLabel>
    <HeadButtonCart>เพิ่มลงในตะกรา</HeadButtonCart>
  </HeadViewContent>;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;

const HeadView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  padding: 48px 256px;
`;
const HeadViewContent = styled.div<{ $width: string; }>`
  width: ${prop => prop.$width};
  height: 100%;
`;
const HeadTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  padding-bottom: 8px;
`;
const HeadTitleLabel = styled.div`
  width: 100%;
  height: 24px;

  * { padding-right: 8px; }
`;
const HeadButtonCart = styled.button`
  width: 256px;
`;