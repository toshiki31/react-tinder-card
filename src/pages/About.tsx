import type React from "react";
import { DB, TinderSwipe } from "../components/TinderSwipe";
import Comic1 from "../assets/comic_1.png";
import Comic2 from "../assets/comic_2.png";
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
    <div className="min-h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold underline">About Page</h1>
        <TinderSwipe db={db} />
      </div>
    </div>
  );
};
