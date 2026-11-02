import { useEffect, useRef, useState } from 'react';
import { technologies } from '../constants/technologies';

interface SkillsInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  error?: string;
}

export const SkillsInput = ({
  skills,
  onSkillsChange,
  error,
}: SkillsInputProps) => {
  const [skillInput, setSkillInput] = useState('');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const normalizedInput = skillInput.trim().toLowerCase();

  const suggestions = technologies.filter(
    (technology) =>
      technology.toLowerCase().includes(normalizedInput) &&
      !skills.some((skill) => skill.toLowerCase() === technology.toLowerCase()),
  );

  const addSkill = (technology: string) => {
    const trimmedSkill = technology.trim();

    if (!trimmedSkill) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase(),
    );

    if (!alreadyExists) {
      onSkillsChange([...skills, trimmedSkill]);
    }

    setSkillInput('');
    setIsSuggestionsOpen(false);
  };

  const removeSkill = (technology: string) => {
    onSkillsChange(skills.filter((skill) => skill !== technology));
  };

  return (
    <div ref={containerRef}>
      <label
        htmlFor="skillInput"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Технологический стек
      </label>

      <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 p-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:cursor-default"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Удалить ${skill}`}
              className="ml-1 cursor-pointer rounded-full hover:text-red-600"
            >
              ×
            </button>
          </span>
        ))}

        <input
          id="skillInput"
          value={skillInput}
          onChange={(event) => {
            setSkillInput(event.target.value);
            setIsSuggestionsOpen(true);
          }}
          onFocus={() => setIsSuggestionsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();

              // Здесь можно сначала брать точное совпадение, а не suggestions[0]. «Java» попадёт в «JavaScript»: он раньше в списке, а фильтр проверяет includes.
              if (suggestions.length > 0) {
                addSkill(suggestions[0]);
              } else if (skillInput.trim()) {
                addSkill(skillInput);
              }
            }

            if (event.key === 'Escape') {
              setIsSuggestionsOpen(false);
            }
          }}
          className="min-w-32 flex-1 border-0 bg-transparent py-1 outline-none"
          placeholder={
            skills.length ? 'Добавить технологию...' : 'Например, React'
          }
          autoComplete="off"
          role="combobox"
          // Здесь можно добавить aria-autocomplete="list" и aria-activedescendant. Списку ниже — role="listbox", пунктам — role="option" и id. Сейчас это поле с подсказками, но для скринридера оно не связано со списком как combobox.
          aria-expanded={isSuggestionsOpen && Boolean(normalizedInput)}
          aria-controls="skill-suggestions"
        />
      </div>

      {/* Здесь можно не показывать список, если подсказок нет и такой навык уже добавлен. Сейчас остаётся пустой ul с рамкой. */}
      {isSuggestionsOpen && normalizedInput && (
        <ul
          id="skill-suggestions"
          className="mt-1 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.slice(0, 8).map((technology) => (
            <li key={technology}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addSkill(technology)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:cursor-pointer"
              >
                {technology}
              </button>
            </li>
          ))}

          {!skills.some((skill) => skill.toLowerCase() === normalizedInput) && (
            <li>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addSkill(skillInput)}
                className="w-full border-t border-gray-100 px-4 py-2 text-left text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Добавить «{skillInput.trim()}»
              </button>
            </li>
          )}
        </ul>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Выберите технологию из подсказок или введите собственную. Нажмите Enter,
        чтобы добавить.
      </p>

      {/* Здесь можно связать ошибку с полем: id="skills-error", у input aria-invalid и aria-describedby="skills-error". Иначе скринридер не читает текст ошибки вместе с полем. */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
