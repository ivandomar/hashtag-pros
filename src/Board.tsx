import { useState } from "react";
import Tile, { type TileVariant } from "./Tile";
import MovesExhaustedDialog from "./MovesExhaustedDialog";
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

function isLetterNeeded(word: string | undefined, letter: string, wordTiles: RawTile[], axis: "row" | "col"): boolean {
  if (!word || !word.includes(letter)) {
    return false;
  }

  const requiredCount = [...word].filter((char) => char === letter).length;
  const claimedCount = wordTiles.filter((tile) => {
    const index = axis === "row" ? tile.col - 1 : tile.row - 1;

    return word[index] === letter && tile.letter === letter;
  }).length;

  return claimedCount < requiredCount;
}

function getTileVariant(tile: RawTile, allTiles: RawTile[]): TileVariant {
  const horizontalWord = WORDS[`row${tile.row}`];
  const verticalWord = WORDS[`col${tile.col}`];
  const correctLetter = horizontalWord?.[tile.col - 1] ?? verticalWord?.[tile.row - 1];

  if (tile.letter === correctLetter) {
    return "green";
  }

  const rowTiles = allTiles.filter((other) => other.row === tile.row);
  const colTiles = allTiles.filter((other) => other.col === tile.col);

  if (
    isLetterNeeded(horizontalWord, tile.letter, rowTiles, "row") ||
    isLetterNeeded(verticalWord, tile.letter, colTiles, "col")
  ) {
    return "yellow";
  }

  return "gray";
}

function withVariants(rawTiles: RawTile[]): BoardTile[] {
  return rawTiles.map((tile) => ({ ...tile, variant: getTileVariant(tile, rawTiles) }));
}

function Board({ movesLeft, onSwap }: BoardProps) {
  const [tiles, setTiles] = useState<BoardTile[]>(() => withVariants(RAW_TILES));
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [showMovesExhaustedDialog, setShowMovesExhaustedDialog] = useState(false);

  const handleTileClick = (position: number) => {
    if (showMovesExhaustedDialog) {
      return;
    }

    if (hasWon) {
      window.alert("Você já venceu! Não é possível continuar jogando.");

      return;
    }

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

    const first = tiles.find((tile) => tile.position === selectedPosition);
    const second = tiles.find((tile) => tile.position === position);

    if (!first || !second) {
      return;
    }

    const nextRawTiles = tiles.map((tile) => {
      if (tile.position === selectedPosition) {
        return { ...tile, letter: second.letter };
      }

      if (tile.position === position) {
        return { ...tile, letter: first.letter };
      }

      return tile;
    });

    const nextTiles = withVariants(nextRawTiles);

    setTiles(nextTiles);
    setSelectedPosition(null);
    onSwap();

    if (nextTiles.every((tile) => tile.variant === "green")) {
      setHasWon(true);
      window.alert("Parabéns! Você venceu o jogo!");
    } else if (movesLeft <= 1) {
      setShowMovesExhaustedDialog(true);
    }
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

      {showMovesExhaustedDialog && <MovesExhaustedDialog onClose={() => setShowMovesExhaustedDialog(false)} />}
    </div>
  );
}

export default Board;
