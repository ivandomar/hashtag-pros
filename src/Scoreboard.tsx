type ScoreboardProps = {
  movesLeft: number;
};

function Scoreboard({ movesLeft }: ScoreboardProps) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2 text-center">
      <p className="font-jakarta text-[40px] leading-none font-medium text-[#264d0d] dark:text-[#a3d977]">
        {movesLeft}
      </p>
      <p className="font-jakarta text-[15px] whitespace-nowrap text-[#888888] uppercase">Trocas restantes</p>
    </div>
  );
}

export default Scoreboard;
