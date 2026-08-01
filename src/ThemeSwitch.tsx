type ThemeSwitchProps = {
  isDark: boolean;
  onToggle: () => void;
};

function ThemeSwitch({ isDark, onToggle }: ThemeSwitchProps) {
  const knobPosition = isDark ? "translate-x-7" : "translate-x-0";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Alternar tema claro/escuro"
      onClick={onToggle}
      className="relative h-7 w-14 rounded-full bg-zinc-300 transition-colors duration-200 dark:bg-zinc-700"
    >
      <span
        className={
          "absolute top-1 left-1 h-5 w-5 rounded-full bg-zinc-50 transition-transform duration-200 " +
          `dark:bg-zinc-400 ${knobPosition}`
        }
      />
    </button>
  );
}

export default ThemeSwitch;
