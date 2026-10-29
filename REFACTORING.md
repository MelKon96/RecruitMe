# Что поменять в `src`

В коде стоят комментарии «Здесь можно…». Ниже тот же список: файл, строка комментария и что сделать. Поведение приложения не менялось.

## Общие модули, которые уберут копипаст

Имеет смысл сделать это первым, остальные пункты на него опираются.

1. `src/storage/resumeStorage.ts` и хук `useResume()` — ключ `recruit_me_resume`, парсинг JSON, событие `resume-updated`. Сейчас это размазано по четырём страницам.
2. `src/storage/conversationsStorage.ts` — тип переписки, ключ `recruit_me_conversations`, чтение и запись. Сейчас копия в `MessagesPage` и `ChatPage`.
3. Константа `DEV_LEVELS = ['Junior', 'Middle', 'Senior', 'Lead'] as const` — из неё тип `DevLevel`, `z.enum` и опции селекта.
4. Константа `OWN_RESUME_ID = -1` — своё резюме. Сейчас число зашито в форме, карточке и чате.
5. Один тип сырого пользователя dummyjson — сейчас `IRawDummyUser` в адаптере и `IRawUser` в API.
6. `constants/levelColors.ts` или компонент `LevelBadge` — палитра уровней скопирована в двух карточках.

## Список правок

### `src/utils/adapters.ts`

| Строка | Что изменить |
| --- | --- |
| 3 | Удалить локальный `IRawDummyUser` и импортировать общий тип сырого ответа dummyjson. Тот же интерфейс объявлен в `api/usersApi.ts`. |
| 19 | Удалить `POSSIBLE_SKILLS` и брать навыки из `constants/technologies.ts`. |
| 33 | Заменить `POSSIBLE_LEVELS` на общую константу `DEV_LEVELS`. Из неё же вывести `DevLevel`, zod-enum и опции в `ResumeForm`. |
| 68 | Не подставлять один и тот же `bio` всем пользователям: собирать текст из должности и уровня или оставлять пустым, если в API его нет. |

### `src/types/user.ts`

| Строка | Что изменить |
| --- | --- |
| 1 | Вывести `DevLevel` из `DEV_LEVELS` (`as const`), чтобы уровни не расходились со схемой и формой. |
| 22 | Удалить `IFilterParams`: тип нигде не импортируется. Либо подключить его к поиску на `UsersPage` (`search`, `skills`, `level`). |

### `src/schemas/resumeSchema.ts`

| Строка | Что изменить |
| --- | --- |
| 7 | Заменить `z.enum(['Junior', 'Middle', 'Senior', 'Lead'])` на `z.enum(DEV_LEVELS)`. |
| 11 | Описать `skills` как `z.array(z.string()).min(1)`. Сейчас это строка через запятую, а `CreateResumePage` параллельно держит `string[]` и синхронизирует их через `setValue` и скрытый input. |

### `src/constants/paths.ts`

| Строка | Что изменить |
| --- | --- |
| 1 | Сделать `ROUTES` единственным источником путей и собирать `routeTree` из этих констант. В `router.tsx` те же строки (`/`, `/users/$id`, `/chat/$userId` и остальные) записаны ещё раз. |

### `src/constants/technologies.ts`

| Строка | Что изменить |
| --- | --- |
| 1 | Импортировать этот список в `utils/adapters.ts` вместо отдельного `POSSIBLE_SKILLS`. |

### `src/api/usersApi.ts`

| Строка | Что изменить |
| --- | --- |
| 4 | Импортировать общий тип сырого пользователя, не описывать `IRawUser` второй раз. |
| 36 | Вынести проверку `response.ok` и `response.json()` в `requestJson<T>(url, signal)`. То же самое повторяется в `fetchUserById`. |
| 50 | Завести `queryKeys` (`users`, `user(id)`, `usersInfinite`) рядом с функциями API. Сейчас ключи `['users']`, `['user', id]` и `['users-infinite']` размазаны по страницам. |

### `src/router/router.tsx`

| Строка | Что изменить |
| --- | --- |
| 19 | Вынести разметку root-роута в `components/RootLayout.tsx`. Пути взять из `constants/paths.ts`. Добавить `validateSearch` для `/` (поле `search`) и `/chat/$userId` (поле `from`: `'user' \| 'messages'`), чтобы `useSearch` был типизирован и в `ChatPage` пропали приведения `as { from?: string }`. |

### `src/pages/UsersPage.tsx`

| Строка | Что изменить |
| --- | --- |
| 9 | Заменить ключ, `JSON.parse` и событие `resume-updated` на хук `useResume()`. |
| 17 | Читать и писать поиск через `useSearch` / `useNavigate`. Сейчас query берётся один раз из `window.location` и не синхронизируется с `?search=`, который ставит `UserDetailCard` по клику на навык. |
| 69 | Вынести `IntersectionObserver` в хук `useInfiniteScroll(loadMoreRef, { hasNextPage, isFetchingNextPage, fetchNextPage })`. |
| 96 | Вынести фильтр по имени и навыкам в `utils/filterUsers.ts`. Страница совмещает загрузку, localStorage, скролл и поиск. |

### `src/pages/UserDetailPage.tsx`

| Строка | Что изменить |
| --- | --- |
| 15 | Не читать `localStorage` в теле компонента на каждый рендер. Взять тот же `useResume()`, что и на остальных страницах. |

### `src/pages/MyResumesPage.tsx`

| Строка | Что изменить |
| --- | --- |
| 7 | Читать и удалять резюме через общий storage-модуль. Событие `resume-updated` на строке с `dispatchEvent` тоже заменить вызовом этого модуля. |
| 46 | Поставить иконку `FileText` из `lucide-react` вместо ручного svg. `Pencil` и `Trash2` на этой странице уже из этой библиотеки. |
| 83 | Собрать карточку резюме из тех же блоков, что `UserDetailCard` (навыки, о себе, контакты), а не верстать профиль второй раз. |

### `src/pages/CreateResumePage.tsx`

| Строка | Что изменить |
| --- | --- |
| 11 | Убрать свой `getSavedResume` и писать через общий storage. |
| 60 | Вынести сборку `IUser` в `toResume(data)` и заменить `id: -1` на `OWN_RESUME_ID`. |
| 76 | Убрать `as DevLevel`, когда enum схемы и тип берутся из `DEV_LEVELS`. |

### `src/pages/MessagesPage.tsx`

| Строка | Что изменить |
| --- | --- |
| 9 | Перенести `IConversation`, `CONVERSATIONS_KEY` и `getConversations` в `storage/conversationsStorage.ts`. |
| 45 | Грузить пользователей по id из переписок, а не `fetchUsers({ limit: 10 })`. Диалог с человеком вне первой страницы dummyjson пропадает из списка, потому что ниже переписка показывается только если пользователь есть в этих десяти записях. |

### `src/pages/ChatPage.tsx`

| Строка | Что изменить |
| --- | --- |
| 8 | Забрать `IMessage`, `IConversation` и `getConversations` в общий storage с `MessagesPage`. Разнести `ChatError` и `ChatConversation` по файлам: страница, сокет и localStorage сейчас в одном модуле. |
| 35 | Убрать `as { from?: string }` за счёт `validateSearch` роута. Сравнение `userId === '-1'` заменить на `String(OWN_RESUME_ID)`. |
| 148 | Не вызывать `useSearch` второй раз в `ChatConversation`, а получить `from` пропсом. |
| 202 | Вынести сокет, статус и сохранение сообщений в хук `useChatSocket(userId)`. |

### `src/components/UserCard.tsx`

| Строка | Что изменить |
| --- | --- |
| 8 | Вынести `levelColors` в `constants/levelColors.ts` или компонент `LevelBadge`. |
| 17 | Заменить кликабельный `div` на `button` или `article` с обработчиком клавиатуры: сейчас карточка не получает фокус. |

### `src/components/UserDetailCard.tsx`

| Строка | Что изменить |
| --- | --- |
| 10 | Импортировать `levelColors` из общего модуля с `UserCard`. |
| 99 | Проверять непустой `trim`, а не `phone.length > 7`. Правило «телефон указан» заодно добавить в `resumeSchema`. |
| 112 | Сравнивать `user.id` с `OWN_RESUME_ID`, а не с `-1`. |

### `src/components/Header.tsx`

| Строка | Что изменить |
| --- | --- |
| 31 | Завести массив `NAV_ITEMS` и отрисовать его и в десктопном `nav`, и в мобильном ниже. Три ссылки («Специалисты», «Сообщения», «Мои резюме») описаны дважды. |

### `src/components/ResumeForm.tsx`

| Строка | Что изменить |
| --- | --- |
| 17 | Импортировать `DEV_LEVELS` вместо локального `levels`. Повторяющиеся блоки `label` + `input` + текст ошибки собрать в компонент `Field`. |
| 33 | Оставить в компоненте только `form`. Заголовок, ссылку «назад» и внешнюю `section` держать на `CreateResumePage`: сейчас форма вложена во вторую `section` с собственными `max-w-3xl` и `py-10`. |

### `src/components/SkillsInput.tsx`

| Строка | Что изменить |
| --- | --- |
| 86 | Закрывать подсказки по клику снаружи через ref. `setTimeout(150)` в `onBlur` нужен только чтобы успеть поймать click по пункту, хотя `onMouseDown` на кнопке уже вызывает `preventDefault`. |
| 149 | Убрать скрытый input `skills`, когда поле в схеме станет `string[]` и значение пойдёт через `Controller` или `setValue` без `join` через запятую. |

### `src/components/ScrollToTop.tsx`

| Строка | Что изменить |
| --- | --- |
| 33 | Заменить ручной svg на `ChevronUp` из `lucide-react`. |

### `src/index.css`

| Строка | Что изменить |
| --- | --- |
| 3 | Оставить у `#root` только колонку на всю ширину. `max-width: 1200px` и `padding: 0 24px` дублируют `max-w-7xl` и `px-4` на страницах, из-за этого шапка и контент сужаются дважды. |

### `src/main.tsx`

| Строка | Что изменить |
| --- | --- |
| 7 | Задать `QueryClient` `defaultOptions` (`staleTime`, `retry`) в одном месте. |

### `src/app/App.tsx`

| Строка | Что изменить |
| --- | --- |
| 4 | Сделать именованный `export function App` и поправить импорт в `main.tsx`. В остальных модулях default export не используется. |

## Что трогать не нужно

`NotFoundPage.tsx` и `Footer.tsx` маленькие и без дублирования. `ScrollToTop` кроме иконки уже собран нормально: слушатель скролла с `passive` и очисткой в эффекте.
