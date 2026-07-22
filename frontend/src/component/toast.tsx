import styled from "styled-components";
import context from "#context/common.ui.ts";

import { useEffect, useRef, useState } from "react";

const content = function Toast ()
{
  return content.Root;
}
content.Root = function ToastRoot (prop: PropRoot)
{
  return (
    <StyleRoot>
      <StyleInner>
        <StyleView $visible={prop.visible ?? false}>
          <p>{prop.text}</p>
        </StyleView>
      </StyleInner>
    </StyleRoot>
  );
}
content.Provider = function ToastProvider ()
{
  const [visible, setVisible] = useState (false);
  const [icon, setIcon] = useState<string | React.ComponentType<unknown> | React.ReactElement> ("");
  const [text, setText] = useState ("");
  const duration = useRef (0);

  const timeout = useRef (0);
  const toast = context.useToast ();

  const runTimeout = () =>
  {
    clearTimeout (timeout.current);
    timeout.current = setTimeout (() =>
    {
      setVisible (false);
    },
    duration.current);
  };

  useEffect (() =>
  {
    toast.setIcon = (value) => { setIcon (value); }
    toast.setText = (value) => { setText (value); }
    toast.setDuration = (value) => { duration.current = (value); }
    toast.setVisible = (value) => { setVisible (value); runTimeout (); }

    return () =>
    {
      toast.setIcon = () => { return; }
      toast.setText = () => { return; }
      toast.setDuration = () => { return; }
      toast.setVisible = () => { return; }
    }
  },
  [toast]);

  useEffect (() =>
  {
    return () =>
    {
      clearTimeout (timeout.current);
    }
  },
  []);

  return (
    <content.Root 
      visible={visible}
      icon={icon}
      text={text}/>
  );
}

const StyleRoot = styled.div`
  display: block;
  pointer-events: none;
  position: fixed;
  inset: 0px;
  z-index: 1000;
`;
const StyleInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const StyleView = styled.div<{ $visible: boolean; }>`
  position: absolute;
  inset: auto auto 16px 16px;
  width: auto;
  height: 40px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 16px;
  align-items: center;
  padding: 0px 16px;

  transform: translateY(${prop => prop.$visible ? "0px" : "64px"});
  transition: transform 250ms linear;
`;

export interface PropRoot
{
  visible ?: boolean;
    icon ?: string | React.ComponentType<unknown> | React.ReactElement;
  text ?: string;
}

/**
 * ส่งออกตัวแปร
*/
export default content;