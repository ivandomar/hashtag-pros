import Tile, { type TileState, type TileVariant } from "./Tile";

type TileData = {
  id: string;
  letter: string;
  variant: TileVariant;
  col: number;
  row: number;
  state?: TileState;
};

// Grid shaped like a "#" — the board is 5x5 but only the cross-bars are filled.
const TILES: TileData[] = [
  { id: "t1", letter: "A", variant: "green", col: 2, row: 1 },
  { id: "t2", letter: "A", variant: "yellow", col: 4, row: 1 },

  { id: "t3", letter: "A", variant: "gray", col: 1, row: 2, state: "active" },
  { id: "t4", letter: "A", variant: "yellow", col: 2, row: 2 },
  { id: "t5", letter: "A", variant: "green", col: 3, row: 2 },
  { id: "t6", letter: "A", variant: "yellow", col: 4, row: 2 },
  { id: "t7", letter: "A", variant: "green", col: 5, row: 2 },

  { id: "t8", letter: "A", variant: "gray", col: 2, row: 3 },
  { id: "t9", letter: "A", variant: "gray", col: 4, row: 3 },

  { id: "t10", letter: "A", variant: "yellow", col: 1, row: 4 },
  { id: "t11", letter: "A", variant: "gray", col: 2, row: 4 },
  { id: "t12", letter: "A", variant: "yellow", col: 3, row: 4 },
  { id: "t13", letter: "A", variant: "gray", col: 4, row: 4, state: "selected" },
  { id: "t14", letter: "A", variant: "green", col: 5, row: 4 },

  { id: "t15", letter: "A", variant: "yellow", col: 2, row: 5 },
  { id: "t16", letter: "A", variant: "gray", col: 4, row: 5 },
];

function Board() {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center md:w-auto md:flex-1">
      <div className="grid aspect-square h-[min(100%,680px)] w-auto max-w-[min(100%,680px)] grid-cols-5 grid-rows-5">
        {TILES.map((tile) => (
          <Tile
            key={tile.id}
            letter={tile.letter}
            variant={tile.variant}
            col={tile.col}
            row={tile.row}
            state={tile.state}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
