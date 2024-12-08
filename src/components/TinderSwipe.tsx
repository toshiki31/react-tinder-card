import React, { FC, useState, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "@tanstack/react-router";
import ThumbUp from "../assets/icon_thumb_up.svg";
import ThumbDown from "../assets/icon_thumb_down.svg";
import Undo from "../assets/icon_undo.svg";

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
      <div className="tinder-swipe">
        <div className="cardContainer">
          {db.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, index)}
              onCardLeftScreen={() => outOfFrame(index)}
            >
              <div
                style={{ backgroundImage: "url(" + character.img[0] + ")" }}
                className="card"
              >
                <h3>{character.name}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
        <div className="buttons">
          <button onClick={() => swipe("left")}>
            <img src={ThumbDown} alt="" />
          </button>
          <button onClick={() => goBack()}>
            <img src={Undo} alt="" />
          </button>
          <button onClick={() => swipe("right")}>
            <img src={ThumbUp} alt="" />
          </button>
        </div>
        {lastDirection && (
          <h3 key={lastDirection} className="infoText">
            You swiped {lastDirection}
          </h3>
        )}
      </div>
    </>
  );
};
