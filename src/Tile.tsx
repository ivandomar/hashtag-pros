export type TileVariant = "gray" | "yellow" | "green";
export type TileState = "default" | "active" | "selected";

type TileProps = {
  letter: string;
  variant: TileVariant;
  col: number;
  row: number;
  state?: TileState;
};

const VARIANT_CLASSES: Record<TileVariant, string> = {
  gray: "bg-[#dcdcdc] text-[#2b2b29] dark:bg-[#52525b] dark:text-[#e4e4e7]",
  yellow: "bg-[#f9df6d] text-[#613805] dark:bg-[#7c5e10] dark:text-[#fde68a]",
  green: "bg-[#a0c35a] text-[#264d0d] dark:bg-[#3f5f2a] dark:text-[#d9f2c4]",
};

const STATE_CLASSES: Record<TileState, string> = {
  default: "",
  active: "shadow-[0_0_10px_1px_rgba(0,0,0,0.25)] dark:shadow-[0_0_10px_1px_rgba(255,255,255,0.2)]",
  selected: "border-[3px] border-[#2babf0]",
};

function Tile({ letter, variant, col, row, state = "default" }: TileProps) {
  return (
    <div
      className={`flex items-center justify-center font-ui text-[30px] font-medium
        ${VARIANT_CLASSES[variant]} ${STATE_CLASSES[state]}`}
      style={{ gridColumn: col, gridRow: row }}
    >
      {letter}
    </div>
  );
}

export default Tile;
