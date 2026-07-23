import { defaultDialog, defaultPreview, useDialog, usePreview } from "#context/common.ui.ts";
import { useState, useEffect, useRef }from "react";
import { styled } from "styled-components";

export function Dialog (property: Dialog)
{
    const hidden = property.hidden ?? false;
    const title = property.data?.title ?? "";
    const text = property.data?.message ?? "";

    const primary = property.data?.primary ?? "";
    const primaryClick = property.data?.primaryClick ?? function () { 
      return; 
    };

    const secondary = property.data?.secondary ?? "";
    const secondaryClick = property.data?.secondaryClick ?? function () { 
      return; 
    };

    function pressPrimary (event: React.MouseEvent)
    {
        event.preventDefault ();
        event.stopPropagation ();

        primaryClick ();
    }
    function pressSecondary (event: React.MouseEvent)
    {
        event.preventDefault ();
        event.stopPropagation ();

        secondaryClick ();
    }
    function pressDismiss (event: React.MouseEvent)
    {
        event.preventDefault ();
        event.stopPropagation ();
    }

    return <StyleDialogRoot $hidden={hidden}>
      <StyleDialogRootInner>
        <StyleDialogBackground $hidden={hidden} onClick={pressDismiss}/>
        <StyleDialogFrontground $hidden={hidden}>
          <StyleDialogTitle>{title}</StyleDialogTitle>
          <StyleDialogText>{text}</StyleDialogText>
          <StyleDialogButtonList>
            { (primary.length === 0) ? 
              (<></>) :
              (<StyleDialogButton onClick={pressPrimary}>
                {primary}
              </StyleDialogButton>)}
            { (secondary.length === 0) ? 
              (<></>) :
              (<StyleDialogButton onClick={pressSecondary}>
                {secondary}
               </StyleDialogButton>)}
          </StyleDialogButtonList>
        </StyleDialogFrontground>
      </StyleDialogRootInner>
    </StyleDialogRoot>;
}
export function DialogProvider ()
{
    const [hidden, setHidden] = useState (true);
    const [data, setData] = useState<DialogData | undefined> (undefined);
    const [, setContext] = useDialog ();
    const temp = useRef<DialogData | undefined> (undefined);

    useEffect (() =>
    {
        setContext ({
          setVisible: (value) => { setHidden (!value); },
          setTitle: (value) => 
          { 
            temp.current = { ... temp.current, title: value };
            setData (temp.current); 
          },
          setMessage: (value) => 
          {
            temp.current = { ... temp.current, message: value };
            setData (temp.current); 
          },
          setPrimary: (text, callback) => 
          { 
            temp.current = { 
              ... temp.current, 
              primary: text, primaryClick: callback 
            };
            setData (temp.current); 
          },
          setSecondary: (text, callback) => 
          { 
            temp.current = { 
              ... temp.current, 
              secondary: text, secondaryClick: callback 
            };
            setData (temp.current); 
          },
          reset: () => 
          {
            temp.current = undefined;
            setData (undefined);
          },
        });

        return () =>
        {
          setContext (defaultDialog ());
        }
    },
    [data, setContext]);

    return <>
      <Dialog hidden={hidden} data={data}/>
    </>;
}

export function Preview (property: Preview)
{
    const src = property.data?.source ?? undefined;
    const cancel = property.data?.onCancel ?? function () { return; }

    return <>
      <StylePreviewRoot $hidden={property.hidden}>
        <StylePreviewRootContainer onClick={cancel}>
          <StylePreviewImageContent src={src}/>
        </StylePreviewRootContainer>
      </StylePreviewRoot>
    </>;
}

export function PreviewProvider ()
{
    const [hidden, setHidden] = useState (true);
    const [data, setData] = useState<PreviewData | undefined> (undefined);
    const [, setContext] = usePreview ();
    const temp = useRef<PreviewData | undefined> (undefined);

    useEffect (() =>
    {
      setContext ({
        setVisible: (value) => { setHidden (!value); },
        setSource: (value) => 
        {
          temp.current = { 
            ... temp.current, 
            onCancel: () => { setHidden (false); },
            source: value
          };
          setData (temp.current);
        },
        reset: () => 
        {
          setData (undefined);
        },
      });

      return () =>
      {
        setContext (defaultPreview ());
      }
    },
    []);

    return <>
      <Preview hidden={hidden} data={data}/>
    </>
}


const StyleDialogRoot = styled.div<{ $hidden: boolean; }>`
    display: block;
    position: fixed;
    inset: 0px;
    width: 100%;
    height: 100%;
    pointer-events: ${prop => prop.$hidden ? "none" : "all"};
    z-index: 2000;

    transition-property: opacity;
    transition-duration: 250ms;
    transition-timing-function:  cubic-bezier(0.16, 1, 0.3, 1);

    opacity: ${prop => prop.$hidden ? "0.0" : "1.0"};
`;

const StyleDialogRootInner = styled.div `
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
`;
const StyleDialogBackground = styled.div<{ $hidden: boolean }>`
    display: block;
    position: absolute;
    inset: 0px;
    background-color: rgba(0, 0, 0, 0.5);

    transition-property: opacity;
    transition-duration: 250ms;
    transition-timing-function:  cubic-bezier(0.16, 1, 0.3, 1);

    opacity: ${prop => prop.$hidden ? "0.0" : "1.0"};
    pointer-events: ${prop => prop.$hidden ? "none" : "auto"};
`;
const StyleDialogFrontground = styled.div<{ $hidden: boolean }>`
    display: block;
    position: absolute;
    inset: 0px;

    opacity: 0.0;
    margin: auto;
    width: 100%;
    height: 256px;

    max-width: 768px;
    max-height: 324px;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    background-color: var(--bg-primary);
    border-radius: 12px;
    outline: 2px solid var(--bg-primary-border);

    transition-property: opacity;
    transition-duration: 250ms;
    transition-timing-function:  cubic-bezier(0.16, 1, 0.3, 1);

    opacity: ${prop => prop.$hidden ? "0.0" : "1.0"};
    pointer-events: ${prop => prop.$hidden ? "none" : "auto"};

`;
const StyleDialogTitle = styled.p`
    display: block;
    font-size: 2.5rem !important;
    font-weight: normal !important;
    padding: 24px 24px 12px 24px !important;
    margin: 0px;
`;
const StyleDialogText = styled.p`
    display: block;
    font-size: 1rem !important;
    font-weight: normal !important;
    white-space: pre-wrap;
    padding: 0px 24px 0px 24px !important;
    margin: 0px;
`;
const StyleDialogButtonList = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 1;
    gap: 4px;

    align-items: end;
    padding: 12px 24px 24px 24px;
    margin: 0px;
`;
const StyleDialogButton = styled.button`
    width: 100%;
`;

const StylePreviewRoot = styled.div<{ $hidden: boolean; }>`

    position: absolute;
    inset: 0px;

    visibility: ${prop => prop.$hidden ? "hidden" : "visible"};
    pointer-events: ${prop => prop.$hidden ? "none" : "auto"};

    background-color: rgba(0,0,0,0.5);

`;
const StylePreviewRootContainer = styled.div`

    position: relative;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

`;
const StylePreviewImageContent = styled.img `

    display: block;
    padding: 32px;
    inset: 0px;

    height: 100%;

`;

export interface Dialog
{
    hidden ?: boolean;
    data ?: DialogData;
}
export interface DialogData
{
    readonly title ?: string;
    readonly message ?: string;

    readonly primary ?: string;
    readonly primaryClick ?: () => void;

    readonly secondary ?: string;
    readonly secondaryClick ?: () => void;
}

export interface ContextMenu
{
    hidden ?: boolean;
    inset ?: string;
    children ?: React.ReactNode;

    onCancel ?: () => void;
}
export interface ContextMenuText
{
    icon ?: string;
    text ?: string;
}
export interface ContextMenuButton
{
    icon ?: string;
    text ?: string;
    hidden ?: boolean;
    disabled ?: boolean;

    onSelect ?: () => void;
}

export interface Preview
{
    hidden: boolean;
    data: PreviewData | undefined;
}
export interface PreviewData
{
    source ?: string;

    onCancel ?: () => void;
}