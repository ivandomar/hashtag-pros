import { useEffect, useState } from "react";
import Header from "./Header";
import Scoreboard from "./Scoreboard";
import Board from "./Board";
import AdSlot from "./AdSlot";

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div
      className="flex h-dvh w-full flex-col gap-[50px] overflow-hidden bg-[#f6fff5] px-8 pt-16 pb-[66px]
        dark:bg-zinc-900"
    >
      <Header isDark={isDark} onToggleTheme={() => setIsDark((previous) => !previous)} />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-10 md:flex-row md:gap-16">
        <Scoreboard movesLeft={3} />
        <Board />
      </div>

      <AdSlot />
    </div>
  );
}

export default App;
