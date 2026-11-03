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
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const errorId = 'skillInput-error';

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

  const visibleSuggestions = suggestions.slice(0, 8);

  const activeOptionId =
    isSuggestionsOpen && normalizedInput && visibleSuggestions.length > 0
      ? `skill-option-${activeIndex}`
      : undefined;

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
    setActiveIndex(0);
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
            setActiveIndex(0);
            setIsSuggestionsOpen(true);
          }}
          onFocus={() => setIsSuggestionsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && visibleSuggestions.length > 0) {
              event.preventDefault();
              setActiveIndex((prev) =>
                prev < visibleSuggestions.length - 1 ? prev + 1 : 0,
              );
            }

            if (event.key === 'ArrowUp' && visibleSuggestions.length > 0) {
              event.preventDefault();
              setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : visibleSuggestions.length - 1,
              );
            }

            if (event.key === 'Enter') {
              event.preventDefault();

              const exactMatch = suggestions.find(
                (technology) => technology.toLowerCase() === normalizedInput,
              );

              if (exactMatch) {
                addSkill(exactMatch);
              } else if (visibleSuggestions[activeIndex]) {
                addSkill(visibleSuggestions[activeIndex]);
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
          aria-autocomplete="list"
          aria-expanded={
            isSuggestionsOpen &&
            Boolean(normalizedInput) &&
            visibleSuggestions.length > 0
          }
          aria-controls="skill-suggestions"
          aria-activedescendant={activeOptionId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      {isSuggestionsOpen &&
        normalizedInput &&
        visibleSuggestions.length > 0 && (
          <ul
            id="skill-suggestions"
            role="listbox"
            className="mt-1 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            {visibleSuggestions.map((technology, index) => (
              <li
                key={technology}
                id={`skill-option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => addSkill(technology)}
                className={`w-full cursor-pointer px-4 py-2 text-left text-sm ${
                  activeIndex === index
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700'
                }`}
              >
                {technology}
              </li>
            ))}

            {!skills.some(
              (skill) => skill.toLowerCase() === normalizedInput,
            ) && (
              <li
                role="option"
                aria-selected={false}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addSkill(skillInput)}
                className="cursor-pointer border-t border-gray-100 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Добавить «{skillInput.trim()}»
              </li>
            )}
          </ul>
        )}

      <p className="mt-2 text-xs text-gray-500">
        Выберите технологию из подсказок или введите собственную. Нажмите Enter,
        чтобы добавить.
      </p>

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
