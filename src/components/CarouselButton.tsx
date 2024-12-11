import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { EmblaCarouselType } from "embla-carousel";
import styled from "@emotion/styled";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";

export const EmblaButton = styled.button`
  -webkit-tap-highlight-color: rgba(var(--text-high-contrast-rgb-value), 0.5);
  -webkit-appearance: none;
  appearance: none;
  touch-action: manipulation;
  display: inline-flex;
  text-decoration: none;
  cursor: pointer;
  border: 0;
  padding: 0;
  margin: 0;
  box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
  width: 3.6rem;
  height: 3.6rem;
  z-index: 1;
  border-radius: 50%;
  color: var(--text-body);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 60px;
  transform: translateY(-50%);

  &:disabled {
    color: var(--detail-high-contrast);
  }
`;
export const Prev = styled(EmblaButton)`
  left: 0px;
`;

export const Next = styled(EmblaButton)`
  right: 0px;
`;

export const EmblaButtonSvg = styled.svg`
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 1;
`;

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropType = ComponentPropsWithRef<"button">;

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <Prev {...restProps}>
      <Button
        // className="embla__button embla__button--prev"
        type="button"
      >
        <EmblaButtonSvg>
          <ArrowBackIosNewIcon />
        </EmblaButtonSvg>
        {children}
      </Button>
    </Prev>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <Next {...restProps}>
      <Button
        // className="embla__button embla__button--next"
        type="button"
      >
        <EmblaButtonSvg>
          <ArrowForwardIosIcon />
        </EmblaButtonSvg>

        {children}
      </Button>
    </Next>
  );
};
