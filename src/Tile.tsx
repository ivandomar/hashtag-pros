export type TileVariant = "gray" | "yellow" | "green";
export type TileState = "default" | "active" | "selected";

type TileProps = {
  letter: string;
  variant: TileVariant;
  col: number;
  row: number;
  state?: TileState;
  onClick?: () => void;
};

const VARIANT_CLASSES: Record<TileVariant, string> = {
  gray: "bg-[#dcdcdc] text-[#2b2b29] dark:bg-[#232326] dark:text-[#5a5a60]",
  yellow: "bg-[#f9df6d] text-[#613805]",
  green: "bg-[#a0c35a] text-[#264d0d]",
};

const STATE_CLASSES: Record<TileState, string> = {
  default: "",
  active: "shadow-[0_0_10px_1px_rgba(0,0,0,0.25)] dark:shadow-[0_0_10px_1px_rgba(255,255,255,0.2)]",
  selected: "border-[3px] border-[#2babf0]",
};

function Tile({ letter, variant, col, row, state = "default", onClick }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state === "selected"}
      className={`flex cursor-pointer items-center justify-center font-ui text-[30px] font-medium select-none
        ${VARIANT_CLASSES[variant]} ${STATE_CLASSES[state]}`}
      style={{ gridColumn: col, gridRow: row }}
    >
      {letter}
    </button>
  );
}

export default Tile;
