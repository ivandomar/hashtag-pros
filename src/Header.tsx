import ThemeSwitch from "./ThemeSwitch";

type HeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex w-full shrink-0 items-start justify-between">
      <h1 className="font-display text-[40px] leading-none text-black dark:text-zinc-100">Hashtag Pro</h1>
      <ThemeSwitch isDark={isDark} onToggle={onToggleTheme} />
    </header>
  );
}

export default Header;
