import React, { FC, useState, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
import { useNavigate } from "@tanstack/react-router";
import { Stack, Typography, Button, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import UndoIcon from "@mui/icons-material/Undo";

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
                borderRadius="10px"
                boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
                sx={{
                  backgroundColor: "white", // 背景を白に設定
                  zIndex: db.length - index, // カードの順番を設定（先頭カードが最前面）
                  transform: `translateY(${(db.length - 1 - index) * -15}px) scale(${1 - (db.length - 1 - index) * 0.03})`, // カードを少しずつ下にずらしながらスケールも小さくする
                }}
              >
                {/* 写真部分 */}
                <Box
                  sx={{
                    width: 300,
                    height: 169,
                    margin: "0 auto",
                    backgroundImage: `url(${character.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "10px", // 写真の角を丸くする
                  }}
                />

                {/* 名前部分 */}
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: 2,
                    textAlign: "center",
                    color: "black", // テキストカラー
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
            <ThumbDown />
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
            <UndoIcon />
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
            <ThumbUpIcon />
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
