import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Loads data from the API.
 *   const { data, loading, error, reload, setData } = useApi(() => jobService.getJobs({ q }), [q])
 * `deps` works like useEffect dependencies: the request re-runs when they change.
 * Pass `null` as the fetcher to skip loading (e.g. while a required id is missing).
 */
export default function useApi(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: Boolean(fetcher), error: null })
  const fetcherRef = useRef(fetcher)
  const requestId = useRef(0)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const run = useCallback(() => {
    if (!fetcherRef.current) return Promise.resolve(null)
    const id = ++requestId.current
    setState((current) => ({ ...current, loading: true, error: null }))
    return fetcherRef.current()
      .then((data) => {
        if (id === requestId.current) setState({ data, loading: false, error: null })
        return data
      })
      .catch((error) => {
        if (id === requestId.current) setState((current) => ({ ...current, loading: false, error }))
        return null
      })
  }, [])

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const setData = useCallback((updater) => {
    setState((current) => ({ ...current, data: typeof updater === 'function' ? updater(current.data) : updater }))
  }, [])

  return { ...state, reload: run, setData }
}
