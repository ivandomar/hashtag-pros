import { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-100 text-zinc-700 " +
        "dark:bg-zinc-900 dark:text-zinc-300"
      }
    >
      <h1 className="text-4xl font-semibold">Hashtag pro</h1>
      <ThemeSwitch isDark={isDark} onToggle={() => setIsDark((previous) => !previous)} />
    </main>
  );
}

export default App;
