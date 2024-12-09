import type React from "react";
import { DB, TinderSwipe } from "../components/TinderSwipe";
import Comic1 from "../assets/comic_1.png";
import Comic2 from "../assets/comic_2.png";
import { Stack } from "@mui/material";
// 仮データ
const db: DB[] = [
  {
    id: 1,
    name: "aaa",
    img: Comic1,
  },
  {
    id: 2,
    name: "bbb",
    img: Comic2,
  },
];

export const About: React.FC = () => {
  return (
   <Stack width={820} height={1180} bgcolor="#e9e9e9" justifyContent="center" alignItems="center">
     <TinderSwipe db={db} />
   </Stack>
       
  );
};
