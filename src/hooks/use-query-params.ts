'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type ParamValue = string | number | boolean

interface UseQueryParamsReturn {
  /** The current URLSearchParams object */
  params: URLSearchParams
  /** Full query string including '?' (empty string if no params) */
  queryString: string
  /** Get a single param value */
  get: (key: string) => string | null
  /** Get all values for a param key */
  getAll: (key: string) => string[]
  /** Get all params as a flat Record<string, string> (first value wins) */
  toObject: () => Record<string, string>
  /** Get all params as Record<string, string[]> */
  toEntries: () => Record<string, string[]>
  /** Check if a param key exists */
  has: (key: string) => boolean
  /** Check if a specific key=value pair exists */
  hasValue: (key: string, value: string) => boolean
  /** Set a param (replaces existing). Accepts single key-value or object. */
  set: (keyOrObj: string | Record<string, ParamValue>, value?: ParamValue) => void
  /** Append a value to a param (allows duplicates) */
  append: (key: string, value: ParamValue) => void
  /** Remove a param entirely, or remove only a specific value */
  remove: (key: string, value?: string) => void
  /** Toggle a boolean param on/off */
  toggle: (key: string, onValue?: string) => void
  /** Replace all params at once */
  replaceAll: (params: Record<string, ParamValue | ParamValue[]>) => void
  /** Clear all params */
  clear: () => void
  /** Batch multiple operations at once */
  batch: (updater: (draft: URLSearchParams) => void, options?: NavigateOptions) => void
  /** Number of unique param keys */
  size: number
  /** Whether there are any params */
  isEmpty: boolean
}

interface NavigateOptions {
  /** Use replace instead of push (default: true) */
  replace?: boolean
  /** Scroll to top after navigation (default: false) */
  scroll?: boolean
}

const defaultNavOptions: NavigateOptions = { replace: true, scroll: false }

/**
 * Enhanced hook for working with URL search/query parameters in Next.js.
 *
 * Provides a rich API for reading, setting, appending, removing, toggling,
 * and batch-updating query params with automatic URL synchronization.
 *
 * @example
 * ```tsx
 * const { get, set, remove, toggle, has, toObject, clear } = useQueryParams();
 *
 * // Read
 * const search = get("search");
 * const allTags = getAll("tag");
 *
 * // Write
 * set("page", 2);
 * set({ search: "hello", page: 1 });
 * append("tag", "react");
 * remove("tag", "vue");
 * toggle("debug");
 * clear();
 *
 * // Batch
 * batch((draft) => {
 *   draft.set("page", "1");
 *   draft.delete("oldKey");
 *   draft.append("tag", "new");
 * });
 * ```
 */
export function useQueryParams(options?: NavigateOptions): UseQueryParamsReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const navOptions = useMemo(() => ({ ...defaultNavOptions, ...options }), [options])

  // Navigate helper — applies new params to the URL
  const navigate = useCallback(
    (newParams: URLSearchParams, opts?: NavigateOptions) => {
      const merged = { ...navOptions, ...opts }
      const qs = newParams.toString()
      const url = qs ? `${pathname}?${qs}` : pathname
      if (merged.replace) {
        router.replace(url, { scroll: merged.scroll })
      } else {
        router.push(url, { scroll: merged.scroll })
      }
    },
    [pathname, router, navOptions]
  )

  // Clone current params for mutation
  const cloneParams = useCallback(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  )

  // ── Readers ──────────────────────────────────────────────

  const get = useCallback((key: string) => searchParams.get(key), [searchParams])

  const getAll = useCallback((key: string) => searchParams.getAll(key), [searchParams])

  const has = useCallback((key: string) => searchParams.has(key), [searchParams])

  const hasValue = useCallback(
    (key: string, value: string) => searchParams.getAll(key).includes(value),
    [searchParams]
  )

  const toObject = useCallback((): Record<string, string> => {
    const obj: Record<string, string> = {}
    searchParams.forEach((v, k) => {
      if (!(k in obj)) obj[k] = v
    })
    return obj
  }, [searchParams])

  const toEntries = useCallback((): Record<string, string[]> => {
    const obj: Record<string, string[]> = {}
    searchParams.forEach((v, k) => {
      if (!obj[k]) obj[k] = []
      obj[k].push(v)
    })
    return obj
  }, [searchParams])

  const queryString = useMemo(() => {
    const qs = searchParams.toString()
    return qs ? `?${qs}` : ''
  }, [searchParams])

  const size = useMemo(() => new Set(searchParams.keys()).size, [searchParams])

  const isEmpty = useMemo(() => size === 0, [size])

  // ── Writers ──────────────────────────────────────────────

  const set = useCallback(
    (keyOrObj: string | Record<string, ParamValue>, value?: ParamValue) => {
      const draft = cloneParams()
      if (typeof keyOrObj === 'string') {
        draft.set(keyOrObj, String(value))
      } else {
        for (const [k, v] of Object.entries(keyOrObj)) {
          draft.set(k, String(v))
        }
      }
      navigate(draft)
    },
    [cloneParams, navigate]
  )

  const append = useCallback(
    (key: string, value: ParamValue) => {
      const draft = cloneParams()
      draft.append(key, String(value))
      navigate(draft)
    },
    [cloneParams, navigate]
  )

  const remove = useCallback(
    (key: string, value?: string) => {
      const draft = cloneParams()
      if (value !== undefined) {
        // Remove only the specific value, keep others
        const existing = draft.getAll(key).filter(v => v !== value)
        draft.delete(key)
        existing.forEach(v => draft.append(key, v))
      } else {
        draft.delete(key)
      }
      navigate(draft)
    },
    [cloneParams, navigate]
  )

  const toggle = useCallback(
    (key: string, onValue = 'true') => {
      const draft = cloneParams()
      if (draft.has(key)) {
        draft.delete(key)
      } else {
        draft.set(key, onValue)
      }
      navigate(draft)
    },
    [cloneParams, navigate]
  )

  const replaceAll = useCallback(
    (params: Record<string, ParamValue | ParamValue[]>) => {
      const draft = new URLSearchParams()
      for (const [k, v] of Object.entries(params)) {
        if (Array.isArray(v)) {
          v.forEach(item => draft.append(k, String(item)))
        } else {
          draft.set(k, String(v))
        }
      }
      navigate(draft)
    },
    [navigate]
  )

  const clear = useCallback(() => {
    navigate(new URLSearchParams())
  }, [navigate])

  const batch = useCallback(
    (updater: (draft: URLSearchParams) => void, opts?: NavigateOptions) => {
      const draft = cloneParams()
      updater(draft)
      navigate(draft, opts)
    },
    [cloneParams, navigate]
  )

  return {
    params: searchParams as unknown as URLSearchParams,
    queryString,
    get,
    getAll,
    toObject,
    toEntries,
    has,
    hasValue,
    set,
    append,
    remove,
    toggle,
    replaceAll,
    clear,
    batch,
    size,
    isEmpty
  }
}
