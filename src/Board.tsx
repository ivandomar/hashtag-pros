import Tile, { type TileVariant } from "./Tile";
import boardConfig from "./board.json";

type BoardTile = {
  position: number;
  col: number;
  row: number;
  letter: string;
  variant: TileVariant;
};

const TILES = boardConfig.tiles as BoardTile[];

function Board() {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center md:w-auto md:flex-1">
      <div className="grid aspect-square h-[min(100%,680px)] w-auto max-w-[min(100%,680px)] grid-cols-5 grid-rows-5">
        {TILES.map((tile) => (
          <Tile key={tile.position} letter={tile.letter} variant={tile.variant} col={tile.col} row={tile.row} />
        ))}
      </div>
    </div>
  );
}

export default Board;
