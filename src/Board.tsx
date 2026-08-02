import { useState } from "react";
import Tile, { type TileVariant } from "./Tile";
import boardConfig from "./board.json";

type RawTile = {
  position: number;
  col: number;
  row: number;
  letter: string;
};

type BoardTile = RawTile & {
  variant: TileVariant;
};

type BoardProps = {
  movesLeft: number;
  onSwap: () => void;
};

const RAW_TILES = boardConfig.tiles as RawTile[];
const WORDS: Record<string, string | undefined> = boardConfig.words;

function getTileVariant(col: number, row: number, letter: string): TileVariant {
  const horizontalWord = WORDS[`row${row}`];
  const verticalWord = WORDS[`col${col}`];
  const correctLetter = horizontalWord?.[col - 1] ?? verticalWord?.[row - 1];

  if (letter === correctLetter) {
    return "green";
  }

  if (horizontalWord?.includes(letter) || verticalWord?.includes(letter)) {
    return "yellow";
  }

  return "gray";
}

function Board({ movesLeft, onSwap }: BoardProps) {
  const [tiles, setTiles] = useState<BoardTile[]>(() =>
    RAW_TILES.map((tile) => ({ ...tile, variant: getTileVariant(tile.col, tile.row, tile.letter) })),
  );
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const handleTileClick = (position: number) => {
    if (movesLeft <= 0) {
      window.alert("Seus movimentos acabaram! Não é possível selecionar mais peças.");

      return;
    }

    if (selectedPosition === null) {
      setSelectedPosition(position);

      return;
    }

    if (selectedPosition === position) {
      setSelectedPosition(null);

      return;
    }

    setTiles((previousTiles) => {
      const first = previousTiles.find((tile) => tile.position === selectedPosition);
      const second = previousTiles.find((tile) => tile.position === position);

      if (!first || !second) {
        return previousTiles;
      }

      return previousTiles.map((tile) => {
        if (tile.position === selectedPosition) {
          return { ...tile, letter: second.letter, variant: getTileVariant(tile.col, tile.row, second.letter) };
        }

        if (tile.position === position) {
          return { ...tile, letter: first.letter, variant: getTileVariant(tile.col, tile.row, first.letter) };
        }

        return tile;
      });
    });

    setSelectedPosition(null);
    onSwap();
  };

  return (
    <div
      className="flex aspect-square h-[min(100%,680px)] w-auto min-h-0 min-w-0 items-center justify-center
        [container-type:size]"
    >
      <div className="grid h-[min(100cqw,100cqh)] w-[min(100cqw,100cqh)] grid-cols-5 grid-rows-5">
        {tiles.map((tile) => (
          <Tile
            key={tile.position}
            letter={tile.letter}
            variant={tile.variant}
            col={tile.col}
            row={tile.row}
            state={tile.position === selectedPosition ? "selected" : "default"}
            onClick={() => handleTileClick(tile.position)}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
