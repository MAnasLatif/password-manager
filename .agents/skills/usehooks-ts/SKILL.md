---
name: usehooks-ts
description: "Complete API reference for usehooks-ts — a zero-dependency, TypeScript-first React hooks library. Use when importing or using any hook from usehooks-ts: useBoolean, useCopyToClipboard, useDebounceValue, useDebounceCallback, useLocalStorage, useSessionStorage, useEventListener, useOnClickOutside, useMediaQuery, useWindowSize, useInterval, useTimeout, useCounter, useCountdown, useToggle, useIntersectionObserver, useResizeObserver, useHover, useDarkMode, useTernaryDarkMode, useStep, useMap, useScript, useScreen, useScrollLock, useIsMounted, useIsClient, useIsomorphicLayoutEffect, useEventCallback, useUnmount, useReadLocalStorage, useDocumentTitle, useClickAnyWhere. Contains full signatures, parameters, return types, and usage examples."
---

# usehooks-ts — Complete Reference

**Install:** `npm install usehooks-ts`  
**Package:** zero dependencies, fully tree-shakable, TypeScript-native  
**Docs:** https://usehooks-ts.com  
**GitHub:** https://github.com/juliencrn/usehooks-ts

All hooks are named exports from `usehooks-ts`:

```ts
import { useBoolean, useDebounceValue, useLocalStorage } from "usehooks-ts";
```

---

## State Primitives

### `useBoolean(defaultValue?: boolean): UseBooleanReturn`

Manages boolean state with utility functions.

```ts
const { value, setValue, setTrue, setFalse, toggle } = useBoolean(false);
```

**Return:** `{ value: boolean, setValue, setTrue, setFalse, toggle }`

---

### `useToggle(defaultValue?: boolean): [boolean, () => void, Dispatch<SetStateAction<boolean>>]`

Manages a boolean toggle. Simpler than `useBoolean` when you only need the tuple form.

```ts
const [value, toggle, setValue] = useToggle();
```

---

### `useCounter(initialValue?: number): UseCounterReturn`

Counter with increment, decrement, reset, and setCount.

```ts
const { count, increment, decrement, reset, setCount } = useCounter(0);
```

**Return:** `{ count, increment, decrement, reset, setCount }`

---

### `useStep(maxStep: number): [number, UseStepActions]`

Manages step navigation in multi-step flows. Steps start at 1.

```ts
const [
  currentStep,
  { goToNextStep, goToPrevStep, reset, setStep, canGoToNextStep, canGoToPrevStep },
] = useStep(5);
```

**UseStepActions:** `goToNextStep`, `goToPrevStep`, `reset`, `setStep(n)`, `canGoToNextStep: boolean`, `canGoToPrevStep: boolean`

---

### `useMap<K, V>(initialState?: Map<K,V> | [K,V][]): [Map<K,V>, UseMapActions<K,V>]`

Manages a Map state with setter actions.

```ts
const [map, { set, setAll, remove, reset }] = useMap<string, string>([["key", "value"]]);
```

**UseMapActions:** `set(k, v)`, `setAll(entries)`, `remove(k)`, `reset()`

---

## Debounce

### `useDebounceValue<T>(initialValue: T | (() => T), delay: number, options?): [T, DebouncedState<(value: T) => void>]`

Returns a debounced copy of a value and a setter. Best for debouncing reactive values (e.g. input → debounced search).

```ts
const [debouncedValue, setValue] = useDebounceValue(defaultValue, 500);
// setValue(newValue) — the debounced value updates after `delay` ms
```

**Options:** `{ leading?, trailing?, maxWait?, equalityFn? }`

---

### `useDebounceCallback<T extends (...args: any) => any>(func: T, delay?: number, options?): DebouncedState<T>`

Returns a debounced version of a callback. Best for debouncing event handlers.

```ts
const debounced = useDebounceCallback(setValue, 500);
// debounced(newValue) — invokes setValue after 500ms idle
// debounced.cancel()  — cancel pending call
// debounced.flush()   — invoke immediately
// debounced.isPending() — check if pending
```

**Options:** `{ leading?: boolean, trailing?: boolean, maxWait?: number }`  
Default delay: 500ms

---

## Storage

### `useLocalStorage<T>(key: string, initialValue: T | (() => T), options?): [T, Dispatch<SetStateAction<T>>, () => void]`

Persists state in `localStorage`. Updates across tabs via storage events. Returns `[value, setValue, removeValue]`.

```ts
const [value, setValue, removeValue] = useLocalStorage("my-key", 0);
setValue((x) => x + 1); // functional updates work
removeValue(); // removes key and resets to initialValue
```

**Options:** `{ serializer?, deserializer?, initializeWithValue?: boolean }`  
Set `initializeWithValue: false` in SSR to avoid hydration mismatch.

---

### `useReadLocalStorage<T>(key: string, options?): T | null`

Read-only version of `useLocalStorage`. Reacts to storage changes but cannot write.

```ts
const darkMode = useReadLocalStorage<boolean>("darkMode");
```

**Options:** `{ deserializer?, initializeWithValue?: boolean }`

---

### `useSessionStorage<T>(key: string, initialValue: T | (() => T), options?): [T, Dispatch<SetStateAction<T>>, () => void]`

Same API as `useLocalStorage` but uses `sessionStorage`.

```ts
const [value, setValue, removeValue] = useSessionStorage("session-key", "");
```

**Options:** `{ serializer?, deserializer?, initializeWithValue?: boolean }`

---

## Clipboard

### `useCopyToClipboard(): [CopiedValue, CopyFn]`

Copies text using the Clipboard API.

```ts
const [copiedText, copy] = useCopyToClipboard();
// copiedText: string | null — last copied value
// copy(text: string): Promise<boolean> — returns true on success
```

```ts
copy("hello")
  .then(() => toast.success("Copied!"))
  .catch((err) => console.error(err));
```

---

## Events

### `useEventListener(eventName, handler, element?, options?): void`

Attaches an event listener to window, document, a DOM element ref, or a MediaQueryList ref. Cleans up automatically.

```ts
// Window event (no element arg)
useEventListener("scroll", onScroll);

// Element event
const buttonRef = useRef<HTMLButtonElement>(null);
useEventListener("click", onClick, buttonRef);

// Document event
const docRef = useRef<Document>(document);
useEventListener("visibilitychange", onVisibilityChange, docRef);
```

**Overloads:**

- `useEventListener<K extends keyof WindowEventMap>(eventName, handler, element?, options?)`
- `useEventListener<K extends keyof HTMLElementEventMap, T extends Element>(eventName, handler, element: RefObject<T>, options?)`
- `useEventListener<K extends keyof DocumentEventMap>(eventName, handler, element: RefObject<Document>, options?)`
- `useEventListener<K extends keyof MediaQueryListEventMap>(eventName, handler, element: RefObject<MediaQueryList>, options?)`

---

### `useEventCallback<Args, R>(fn: (...args: Args) => R): (...args: Args) => R`

Returns a stable, memoized callback that always calls the latest version of `fn`. Useful for event handlers in effects without stale closures.

```ts
const handleClick = useEventCallback((event) => {
  console.log("Clicked", event);
});
```

---

### `useClickAnyWhere(handler: (event: MouseEvent) => void): void`

Fires handler on any click anywhere on the document.

```ts
useClickAnyWhere(() => setCount((prev) => prev + 1));
```

---

### `useOnClickOutside<T extends HTMLElement>(ref, handler, eventType?, eventListenerOptions?): void`

Calls handler when user clicks outside the referenced element.

```ts
const ref = useRef(null);
useOnClickOutside(ref, () => setIsOpen(false));

// Multiple refs
useOnClickOutside([ref1, ref2], handleClickOutside);
```

**Parameters:**

- `ref`: `RefObject<T> | RefObject<T>[]`
- `handler`: `(event: MouseEvent | FocusEvent | TouchEvent) => void`
- `eventType?`: `'mousedown'` (default) | `'mouseup'` | `'touchstart'` | `'touchend'` | `'focusin'` | `'focusout'`
- `eventListenerOptions?`: `AddEventListenerOptions`

---

## Timers

### `useInterval(callback: () => void, delay: number | null): void`

Runs `callback` on a repeating interval. Pass `null` to pause.

```ts
useInterval(() => setCount((c) => c + 1), isPlaying ? 1000 : null);
```

---

### `useTimeout(callback: () => void, delay: number | null): void`

Runs `callback` once after `delay` ms. Pass `null` to cancel.

```ts
useTimeout(() => setVisible(false), 5000);
```

---

### `useCountdown(options: CountdownOptions): [number, CountdownControllers]`

Manages a countdown timer.

```ts
const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
  countStart: 60,
  countStop: 0, // default 0
  intervalMs: 1000, // default 1000
  isIncrement: false, // default false (counts down)
});
```

---

## DOM Observers

### `useIntersectionObserver(options?): IntersectionReturn`

Tracks when an element enters/exits the viewport via `IntersectionObserver`.

```ts
const { ref, isIntersecting, entry } = useIntersectionObserver({ threshold: 0.5 })
// Or tuple: const [ref, isIntersecting, entry] = useIntersectionObserver()

return <div ref={ref}>...</div>
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `threshold` | `0` | 0–1 visibility ratio to trigger |
| `root` | `null` | Viewport element |
| `rootMargin` | `'0%'` | Margin around root |
| `freezeOnceVisible` | `false` | Stop observing once intersecting |
| `initialIsIntersecting` | `false` | Initial state |
| `onChange` | `undefined` | `(isIntersecting, entry) => void` |

---

### `useResizeObserver<T extends HTMLElement>(options: UseResizeObserverOptions<T>): Size`

Tracks element size changes via `ResizeObserver`.

```ts
const ref = useRef<HTMLDivElement>(null);
const { width = 0, height = 0 } = useResizeObserver({ ref, box: "border-box" });

// With debounced callback (no re-render):
const onResize = useDebounceCallback(setSize, 200);
useResizeObserver({ ref, onResize });
```

**Options:** `{ ref, box?: 'border-box' | 'content-box' | 'device-pixel-content-box', onResize? }`  
**Returns:** `{ width: number | undefined, height: number | undefined }`

---

## Media / Window

### `useMediaQuery(query: string, options?): boolean`

Tracks a CSS media query match state.

```ts
const isMobile = useMediaQuery("(max-width: 768px)");
const isDark = useMediaQuery("(prefers-color-scheme: dark)");
```

**Options:** `{ defaultValue?: boolean, initializeWithValue?: boolean }`

---

### `useWindowSize(options?): { width: number | undefined, height: number | undefined }`

Tracks `window.innerWidth` and `window.innerHeight`.

```ts
const { width = 0, height = 0 } = useWindowSize();

// With debounce:
const { width } = useWindowSize({ debounceDelay: 200 });

// SSR-safe (returns undefined on server):
const size = useWindowSize({ initializeWithValue: false });
```

---

### `useScreen(options?): Screen`

Tracks the `window.screen` object (width, height, orientation, etc.).

```ts
const screen = useScreen();
// screen.width, screen.height, screen.orientation, etc.

// With debounce:
const screen = useScreen({ debounceDelay: 300 });
```

---

### `useScrollLock(options?): { isLocked: boolean, lock: () => void, unlock: () => void }`

Locks/unlocks body scroll (e.g. when a modal is open).

```ts
// Auto-lock on mount (default):
useScrollLock();

// Manual control:
const { lock, unlock, isLocked } = useScrollLock({ autoLock: false, lockTarget: "#scrollable" });
```

**Options:** `{ autoLock?: boolean (default true), lockTarget?: HTMLElement | string, widthReflow?: boolean (default true) }`

---

## Dark Mode

### `useDarkMode(options?): DarkModeReturn`

Manages dark mode state persisted in `localStorage`, respecting OS preference.

```ts
const { isDarkMode, toggle, enable, disable, set } = useDarkMode();
```

**Options:** `{ defaultValue?: boolean, localStorageKey?: string (default 'usehooks-ts-dark-mode'), initializeWithValue?: boolean }`

---

### `useTernaryDarkMode(options?): TernaryDarkModeReturn`

Three-state dark mode: `'light'` | `'system'` | `'dark'`.

```ts
const { isDarkMode, ternaryDarkMode, setTernaryDarkMode, toggleTernaryDarkMode } =
  useTernaryDarkMode();
// ternaryDarkMode: 'light' | 'system' | 'dark'
// toggleTernaryDarkMode cycles: light → system → dark → light
```

**Options:** `{ defaultValue?: TernaryDarkMode (default 'system'), localStorageKey?, initializeWithValue? }`

---

## DOM / Browser

### `useDocumentTitle(title: string, options?): void`

Sets `document.title`.

```ts
useDocumentTitle("My Page Title");
// Restore previous title on unmount:
useDocumentTitle("My Page", { preserveTitleOnUnmount: false });
```

---

### `useScript(src: string | null, options?): UseScriptStatus`

Dynamically loads an external script and tracks its loading state.

```ts
const status = useScript("https://cdn.example.com/lib.js");
// status: 'idle' | 'loading' | 'ready' | 'error'
if (status === "ready") {
  /* use the script */
}
```

**Options:** `{ shouldPreventLoad?: boolean, removeOnUnmount?: boolean, id?: string }`

---

### `useHover<T extends HTMLElement>(elementRef: RefObject<T>): boolean`

Tracks whether a DOM element is being hovered.

```ts
const hoverRef = useRef(null)
const isHover = useHover(hoverRef)
return <div ref={hoverRef}>{isHover ? 'Hovered' : 'Not hovered'}</div>
```

---

## Lifecycle

### `useIsClient(): boolean`

Returns `true` only on the client (after hydration). Use to guard browser-only code.

```ts
const isClient = useIsClient();
if (isClient) {
  /* safe to access window, document */
}
```

---

### `useIsMounted(): () => boolean`

Returns a function that tells if the component is still mounted. Use to avoid state updates after unmount in async callbacks.

```ts
const isMounted = useIsMounted();
useEffect(() => {
  fetchData().then((data) => {
    if (isMounted()) setState(data);
  });
}, [isMounted]);
```

---

### `useUnmount(func: () => void): void`

Runs a cleanup function exactly once on unmount.

```ts
useUnmount(() => {
  subscription.unsubscribe();
});
```

---

### `useIsomorphicLayoutEffect(effect, deps?): void`

Uses `useLayoutEffect` in the browser and `useEffect` on the server. Prevents SSR warnings.

```ts
useIsomorphicLayoutEffect(() => {
  // runs as useLayoutEffect client-side, useEffect server-side
}, [dep]);
```

---

## Quick Pick Guide

| Task                          | Hook                                  |
| ----------------------------- | ------------------------------------- |
| Open/close modal or sidebar   | `useBoolean`                          |
| Debounce a search input value | `useDebounceValue(value, 300)`        |
| Debounce an event handler     | `useDebounceCallback(fn, 300)`        |
| Persist state across reloads  | `useLocalStorage`                     |
| Session-only storage          | `useSessionStorage`                   |
| Copy to clipboard             | `useCopyToClipboard`                  |
| Click outside to close        | `useOnClickOutside`                   |
| Listen to DOM events          | `useEventListener`                    |
| Stable event handler ref      | `useEventCallback`                    |
| Poll on an interval           | `useInterval`                         |
| Run once after delay          | `useTimeout`                          |
| Countdown timer               | `useCountdown`                        |
| Lazy-load scroll content      | `useIntersectionObserver`             |
| Track element dimensions      | `useResizeObserver`                   |
| Responsive breakpoints        | `useMediaQuery`                       |
| Track window size             | `useWindowSize`                       |
| Prevent body scroll (modal)   | `useScrollLock`                       |
| Dark/light mode               | `useDarkMode` or `useTernaryDarkMode` |
| Multi-step wizard             | `useStep`                             |
| Load external script          | `useScript`                           |
| Safe async state update       | `useIsMounted`                        |
| Cleanup on unmount            | `useUnmount`                          |
| Client-only rendering guard   | `useIsClient`                         |

---

## SSR Notes

Hooks that read browser APIs have an `initializeWithValue` option (default `true`).  
**In Next.js Server Components / SSR, set `initializeWithValue: false`** to return `undefined` initially and avoid hydration mismatches:

```ts
const { width } = useWindowSize({ initializeWithValue: false });
const [value, setValue] = useLocalStorage("key", 0, { initializeWithValue: false });
```
