type ThemeSwitchProps = {
  isDark: boolean;
  onToggle: () => void;
};

function ThemeSwitch({ isDark, onToggle }: ThemeSwitchProps) {
  const knobPosition = isDark ? "translate-x-[47.7px]" : "translate-x-0";

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Alternar tema claro/escuro"
        onClick={onToggle}
        className="relative h-[39px] w-[86.735px] rounded-full bg-[#d4d4d8] transition-colors duration-200
          dark:bg-[#52525b]"
      >
        <span
          className={`absolute top-[4.34px] left-[4.34px] size-[30.357px] rounded-full
            bg-gradient-to-b from-[#fafafa] to-[#e8eaea] transition-transform duration-200 ${knobPosition}`}
        />
      </button>
      <span className="font-ui text-[12px] font-light text-[#4d4d4d] dark:text-zinc-400">
        {isDark ? "DARK" : "LIGHT"}
      </span>
    </div>
  );
}

export default ThemeSwitch;
