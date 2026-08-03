import { useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
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

type Point = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

const RAW_TILES = boardConfig.tiles as RawTile[];
const WORDS: Record<string, string | undefined> = boardConfig.words;
const DRAG_THRESHOLD_PX = 6;

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

function findTilePositionAt(x: number, y: number): number | null {
  const target = document.elementFromPoint(x, y)?.closest("[data-position]");
  const rawPosition = target instanceof HTMLElement ? target.dataset.position : undefined;

  return rawPosition !== undefined ? Number(rawPosition) : null;
}

function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function Board({ movesLeft, onSwap }: BoardProps) {
  const [tiles, setTiles] = useState<BoardTile[]>(() => withVariants(RAW_TILES));
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [activePosition, setActivePosition] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [pointerPoint, setPointerPoint] = useState<Point | null>(null);
  const [draggedTileSize, setDraggedTileSize] = useState<Size | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [showMovesExhaustedDialog, setShowMovesExhaustedDialog] = useState(false);
  const skipNextClickRef = useRef(false);
  const dragStartPointRef = useRef<Point | null>(null);

  const draggedTile =
    hasMoved && activePosition !== null ? tiles.find((tile) => tile.position === activePosition) : undefined;

  const canInteract = () => {
    if (showMovesExhaustedDialog) {
      return false;
    }

    if (hasWon) {
      window.alert("Você já venceu! Não é possível continuar jogando.");

      return false;
    }

    if (movesLeft <= 0) {
      window.alert("Seus movimentos acabaram! Não é possível selecionar mais peças.");

      return false;
    }

    return true;
  };

  const swapTiles = (positionA: number, positionB: number) => {
    const first = tiles.find((tile) => tile.position === positionA);
    const second = tiles.find((tile) => tile.position === positionB);

    if (!first || !second) {
      return;
    }

    const nextRawTiles = tiles.map((tile) => {
      if (tile.position === positionA) {
        return { ...tile, letter: second.letter };
      }

      if (tile.position === positionB) {
        return { ...tile, letter: first.letter };
      }

      return tile;
    });

    const nextTiles = withVariants(nextRawTiles);

    setTiles(nextTiles);
    onSwap();

    if (nextTiles.every((tile) => tile.variant === "green")) {
      setHasWon(true);
      window.alert("Parabéns! Você venceu o jogo!");
    } else if (movesLeft <= 1) {
      setShowMovesExhaustedDialog(true);
    }
  };

  const handleTap = (position: number) => {
    if (!canInteract()) {
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

    swapTiles(selectedPosition, position);
    setSelectedPosition(null);
  };

  const handleClick = (position: number) => {
    if (skipNextClickRef.current) {
      skipNextClickRef.current = false;

      return;
    }

    handleTap(position);
  };

  const endDrag = () => {
    setActivePosition(null);
    setHasMoved(false);
    setHoverPosition(null);
    setPointerPoint(null);
    setDraggedTileSize(null);
    dragStartPointRef.current = null;
  };

  const handlePointerDown = (position: number, event: PointerEvent<HTMLButtonElement>) => {
    if (activePosition !== null) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (!canInteract()) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX, y: event.clientY };

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture is best-effort: hit-testing below relies on elementFromPoint, not on capture.
    }

    dragStartPointRef.current = point;
    setActivePosition(position);
    setHasMoved(false);
    setHoverPosition(null);
    setPointerPoint(point);
    setDraggedTileSize({ width: rect.width, height: rect.height });
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (activePosition === null || dragStartPointRef.current === null) {
      return;
    }

    const point = { x: event.clientX, y: event.clientY };

    setPointerPoint(point);

    const isDragging = hasMoved || distanceBetween(point, dragStartPointRef.current) > DRAG_THRESHOLD_PX;

    if (isDragging && !hasMoved) {
      setHasMoved(true);
    }

    if (!isDragging) {
      return;
    }

    const hovered = findTilePositionAt(point.x, point.y);

    setHoverPosition(hovered !== null && hovered !== activePosition ? hovered : null);
  };

  const handlePointerUp = () => {
    if (activePosition === null) {
      return;
    }

    const pressedPosition = activePosition;
    const wasDragging = hasMoved;
    const droppedOnPosition = hoverPosition;

    endDrag();
    skipNextClickRef.current = true;

    if (wasDragging) {
      if (droppedOnPosition !== null && canInteract()) {
        swapTiles(pressedPosition, droppedOnPosition);
        setSelectedPosition(null);
      }

      return;
    }

    handleTap(pressedPosition);
  };

  const handlePointerCancel = () => {
    endDrag();
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
            position={tile.position}
            hidden={tile.position === activePosition && hasMoved}
            state={
              tile.position === activePosition
                ? "active"
                : tile.position === hoverPosition || tile.position === selectedPosition
                  ? "selected"
                  : "default"
            }
            onClick={() => handleClick(tile.position)}
            onPointerDown={(event) => handlePointerDown(tile.position, event)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          />
        ))}
      </div>

      {draggedTile &&
        pointerPoint &&
        draggedTileSize &&
        createPortal(
          <div
            className="pointer-events-none fixed z-30"
            style={{
              left: pointerPoint.x,
              top: pointerPoint.y,
              width: draggedTileSize.width,
              height: draggedTileSize.height,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Tile
              letter={draggedTile.letter}
              variant={draggedTile.variant}
              position={draggedTile.position}
              state="active"
            />
          </div>,
          document.body,
        )}

      {showMovesExhaustedDialog && <MovesExhaustedDialog onClose={() => setShowMovesExhaustedDialog(false)} />}
    </div>
  );
}

export default Board;
