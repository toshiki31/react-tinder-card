import React, { FC, useState, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
import { useNavigate } from "@tanstack/react-router";
import ThumbUp from "../assets/icon_thumb_up.svg";
import ThumbDown from "../assets/icon_thumb_down.svg";
import Undo from "../assets/icon_undo.svg";
import { Stack, Typography, Button } from "@mui/material";

interface TinderCardAPI {
  swipe(dir?: "left" | "right" | "up" | "down"): Promise<void>;
  restoreCard(): Promise<void>;
}

// 仮データ
export interface DB {
  id: number;
  name: string;
  img: string;
}

interface Props {
  db: DB[];
}

export const TinderSwipe: FC<Props> = ({ db }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastDirection, setLastDirection] = useState<string>();
  const [currentIndex, setCurrentIndex] = useState<number>(db.length - 1);

  /**
   * レンダリングされても状態を保つ（記録する）
   */
  const currentIndexRef = useRef(currentIndex);
  /**
   * dbのlengthだけuseRefを生成する
   * TinderSwipeを通すことでswipeメソッドとrestoreCardメソッドを付与する(useImperativeHandle)
   */
  const childRefs = useMemo<React.RefObject<TinderCardAPI>[]>(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef<TinderCardAPI>()), //memo: i が mapの())内に入っていたがneverusedなので抜いた
    [db.length]
  );
  /**
   * useRefを更新する（valは基本 1 or -1 になる）
   */
  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
    if (currentIndexRef.current === -1) {
      setIsLoading(true);
      setIsLoading(false);
      navigate({ to: "/about/result" });
      //   history.push("/diagnose/result");
    }
  };
  /**
   * goback可能かを監視する
   * DBが5の場合4の時はgobackできない（初期gobackを不可にする）
   */
  const canGoBack = currentIndex < db.length - 1;
  /**
   * スワイプ可能かを監視する
   * DBが5の場合4,3,2,1,0と減っていく
   */
  const canSwipe = currentIndex >= 0;

  const outOfFrame = (idx: number) => {
    if (currentIndexRef.current >= idx) {
      childRefs[idx].current?.restoreCard();
    }
  };
  /**
   * 手動でのスワイプの処理（押下式のスワイプも最終的にはこの関数を叩いている）
   * currentIndexを-1する
   */
  const swiped = (direction: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };
  /**
   * ライブラリのonSwipeを叩く > ローカルで用意しているswipeを叩く
   */
  const swipe = async (direction: "left" | "right" | "up" | "down") => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current?.swipe(direction);
    }
  };
  /**
   * gobackする
   * currentIndexを+1する
   */
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
  };

  return (
    <>
      {isLoading && "Loading"}
      <Stack spacing={2} alignItems="center" sx={{ mt: 5 }}>
        <Stack width={300} height={400} position="relative" overflow="visible">
          {db.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, index)}
              onCardLeftScreen={() => outOfFrame(index)}
            >
              <Stack
                position="absolute"
                width={300}
                height={400}
                borderRadius="20px"
                boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
                sx={{
                  backgroundImage: `url(${character.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    margin: 2,
                    color: "white",
                  }}
                >
                  {character.name}
                </Typography>
              </Stack>
            </TinderCard>
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: 250,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => swipe("left")}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "white",
              border: "2px solid #83C5BE",
              boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.05)",
              transition: "200ms",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <img src={ThumbDown} alt="Thumb Down" />
          </Button>
          <Button
            onClick={() => goBack()}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "white",
              border: "2px solid #83C5BE",
              boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.05)",
              transition: "200ms",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <img src={Undo} alt="Undo" />
          </Button>
          <Button
            onClick={() => swipe("right")}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "white",
              border: "2px solid #83C5BE",
              boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.05)",
              transition: "200ms",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <img src={ThumbUp} alt="Thumb Up" />
          </Button>
        </Stack>

        {lastDirection && (
          <Typography
            variant="h6"
            key={lastDirection}
            sx={{
              width: "100%",
              height: 28,
              display: "flex",
              justifyContent: "center",
              animation: "popup 800ms",
            }}
          >
            You swiped {lastDirection}
          </Typography>
        )}
      </Stack>
    </>
  );
};
