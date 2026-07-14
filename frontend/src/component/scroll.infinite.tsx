import react from "react";
import styled from "styled-components";

interface InfiniteProperty
{
  width ?: string;
  height ?: string;
  margin ?: string;
  display ?: "block" | "flex";
  displayDirection ?: "row" | "column";
  displayGap ?: string;
  translateX ?: number;
  translateY ?: number;
  children ?: react.ReactNode;
}

const content = function ()
{
  return;
}
content.Infinite = function ScrollInfinite (prop: InfiniteProperty)
{
  const reference = react.useRef (HTMLDivElement.prototype);
  const mounted = react.useRef (false);

  const computeTranslation = (element: HTMLElement) =>
  {
    const data = element.style.translate;
    const map = data.split(" ");
    const hasX = map.length >= 1 && map[0].endsWith ("px");
    const hasY = map.length >= 2 && map[1].endsWith ("px");
    const x = hasX ? map[0].substring (0, map[0].length - 2) : "0";
    const y = hasY ? map[1].substring (0, map[1].length - 2) : "0";

    return {
      x: Number (x),
      y: Number (y),
    }
  }

  const isOccludedRight = (child: HTMLElement, parent: HTMLElement) =>
  {
    const targetRect = child.getBoundingClientRect();
    const obscuringRect = parent.getBoundingClientRect();

  // If the obscuring element overlaps the target's right side
    return (
      targetRect.right > obscuringRect.left &&
      targetRect.left < obscuringRect.right &&
      targetRect.bottom > obscuringRect.top &&
      targetRect.top < obscuringRect.bottom &&
      targetRect.right > obscuringRect.right // The target goes further right than the obscurer
    );
  }

  const onAnimate = () =>
  {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!reference.current) {
      return;
    }
    const root = reference.current;
    const children = root.children;


    for (const child of children)
    {
      if (!(child instanceof HTMLElement))
      {
        continue;
      }
      const translation = computeTranslation (child);
      const oldX = translation.x;
      const oldY = translation.y;
      const occluded = isOccludedRight (child, root);
      const resetX = -(child.offsetLeft + child.clientWidth);
      const resetY = 0;
      const newX = (!occluded) ? (oldX + (prop.translateX ?? 0)) : resetX;
      const newY = (!occluded) ? (oldY + (prop.translateY ?? 0)) : resetY;

      child.style.translate = `${String (newX)}px ${String (newY)}px`;
    }
    return;
  }
  const onAnimateLoop = () =>
  {
    if (mounted.current)
    {
      onAnimate ();
      requestAnimationFrame (onAnimateLoop);
    }
  }

  react.useEffect (() =>
  {
    mounted.current = true;
    requestAnimationFrame (onAnimateLoop);

    return () =>
    {
      mounted.current = false;
    }
  },
  []);

  return <Infinite 
      ref={reference}
      $width={prop.width ?? "auto"} 
      $height={prop.height ?? "auto"}
      $margin={prop.margin ?? "0px"}
      $display={prop.display as string}
      $displayDirection={prop.displayDirection ?? "row"}
      $displayGap={prop.displayGap ?? "8px"}
    >
    {prop.children}
  </Infinite>
}

const Infinite = styled.div<{ 
  $width: string; 
  $height: string; 
  $margin: string;
  $display: string;
  $displayDirection: string;
  $displayGap: string;
}>`
  width: ${prop => prop.$width};
  height: ${prop => prop.$height};
  margin: ${prop => prop.$margin};
  display: ${prop => prop.$display};
  flex-direction: ${prop => prop.$displayDirection};
  align-items: start;
  gap: ${prop => prop.$displayGap};
  overflow: hidden;
`;

export default content;