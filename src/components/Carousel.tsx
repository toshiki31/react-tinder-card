import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { PrevButton, NextButton, usePrevNextButtons } from "./CarouselButton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import styled from "@emotion/styled";
import { Stack } from "@mui/material";

export const Embla = styled.div`
  max-width: 100%;
  margin: auto;
  --slide-height: 120px;
  --slide-spacing: 1rem;
  --slide-size: 100%;
`;

export const EmblaViewport = styled.div`
  overflow: hidden;
`;

export const EmblaContainer = styled.div`
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
`;

export const EmblaSlide = styled.div`
  background-color: #ffffff;
  transform: translate3d(0, 0, 0);
  flex: 0 0 var(--slide-size);
  min-width: 0;
  padding-left: var(--slide-spacing);
`;

export const EmblaSlideNumber = styled.div`
  box-shadow: inset 0 0 0 0.2rem var(--detail-medium-contrast);
  border-radius: 1.8rem;
  font-size: 4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--slide-height);
  user-select: none;
`;

export const EmblaControls = styled.div``;

export const EmblaButtons = styled.div``;

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

export const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  return (
    <Embla>
      <EmblaViewport>
        <div ref={emblaRef}>
          <EmblaContainer>
            {slides.map((index) => (
              <EmblaSlide>
                <div key={index}>
                  <EmblaSlideNumber>
                    <div>{index + 1}</div>
                  </EmblaSlideNumber>
                </div>
              </EmblaSlide>
            ))}
          </EmblaContainer>
        </div>

        <EmblaControls>
          <EmblaButtons>
            <Stack direction="row">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </Stack>
          </EmblaButtons>
        </EmblaControls>
      </EmblaViewport>
    </Embla>
  );
};
