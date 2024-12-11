import { Button, Stack } from "@mui/material";
import { Carousel } from "../components/Carousel";
import { EmblaOptionsType } from "embla-carousel";
const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
export const Banner = () => {
  return (
    <Stack width={820} height={1180} bgcolor="#e9e9e9">
      <Stack width="100%" height={120} bgcolor="#333">
        <Carousel slides={SLIDES} options={OPTIONS} />
      </Stack>
      <Button sx={{width: 200, height:100, position: "absolute", bottom: 0, backgroundColor: "#333"}}>
        ボタン
      </Button>
    </Stack>
  );
};
