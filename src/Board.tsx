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
    <div
      className="flex aspect-square h-[min(100%,680px)] w-auto min-h-0 min-w-0 items-center justify-center
        [container-type:size]"
    >
      <div className="grid h-[min(100cqw,100cqh)] w-[min(100cqw,100cqh)] grid-cols-5 grid-rows-5">
        {TILES.map((tile) => (
          <Tile key={tile.position} letter={tile.letter} variant={tile.variant} col={tile.col} row={tile.row} />
        ))}
      </div>
    </div>
  );
}

export default Board;
