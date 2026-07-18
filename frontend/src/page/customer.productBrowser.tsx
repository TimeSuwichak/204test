import react      from "react";
import styled     from "styled-components";
import navigation from "#util/common.navigation.ts";

import { useSearchParams } from "react-router";

import testArtwork from "#asset/image/test.artwork.jpg";

interface PropItem
{
  id: number;
  src: string;
  onClick: (id: number) => void;
}

const content = function ProductBrowser ()
{
  const [serachParam] = useSearchParams ();
  const search = serachParam.get ("search");

  react.useEffect (() =>
  {
    console.log ("SEARCH");
  },
  [search]);

  return (<>
    <content.List/>
    <content.Filter/>
  </>);
}
content.List = function ProductBrowserList ()
{
  const onClick = (id: number) =>
  {
    void navigation.toProduct (id);
    return;
  }

  return (
    <SyledList>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
      <content.ListItem id={1} src={testArtwork} onClick={onClick}/>
    </SyledList>
  );
}
content.ListItem = function ProductBrowserListItem (prop: PropItem)
{
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    prop.onClick (prop.id);
  }

  return (
    <StyledListItemContainer onClick={onClick}>
      <StyledListItem src={prop.src}/>
    </StyledListItemContainer>
  )
}
content.Filter = function ProductBrowserFilter ()
{
  return (
    <StyledFilter>
      <StyledFilterLabel>ตัวเลือก</StyledFilterLabel>
    </StyledFilter>
  );
}

const SyledList = styled.div`

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  overflow: hidden auto;
  margin: 48px 510px 0px 254px;
  padding: 16px 2px 16px 2px;

  @media (max-width: 1600px)
  {
    margin: 48px 510px 16px 126px;
  }
  @media (max-width: 1440px)
  {
    margin: 48px 382px 16px 30px;
  }
  @media (max-width: 1200px)
  {
    margin: 48px 382px 16px 14px;
  }
  @media (max-width: 1024px)
  {
    margin: 48px 62px 16px 62px;
  }
  @media (max-width: 768px)
  {
    margin: 48px 14px 16px 14px;
  }
`;
const StyledListItemContainer = styled.button`
  width: 200px;
  height: 300px;
  display: block;
  margin: 0px;
  padding: 0px;

  outline: var(--bg-primary-border) solid 0px;
  background-color: #282828;
  transition: outline 66ms cubic-bezier(0.16, 1, 0.3, 1);
  transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
  transition: height 500ms cubic-bezier(0.16, 1, 0.3, 1);

  &:hover, &:focus
  {
    outline-width: 0px;
  }
  &:active
  {
    outline-width: 2px;
  }

  @media (max-width: 960px)
  {
    width: 150px;
    height: 200px;
  }
  @media (max-width: 640px)
  {
    width: 125px;
    height: 175px;
  }
  @media (max-width: 512px)
  {
    width: 100px;
    height: 150px;
  }
`;
const StyledListItem = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -ms-user-select: none;
`;
const StyledFilter = styled.div`
  position: fixed;
  inset: 64px 144px auto auto;
  width: 324px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  padding: 8px 16px;

  @media (max-width: 1920px)
  {
    inset: 64px 192px auto auto;
  }
  @media (max-width: 1440px)
  {
    inset: 64px 64px auto auto;
  }
  @media (max-width: 1024px)
  {
    display: none;
    inset: 0px 0px 0px 0px;
  }
`;
const StyledFilterLabel = styled.label`
  width: 100%;
  height: 32px;
  display: block;
  font-size: 1.25rem;
  font-weight: normal;
`;

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;