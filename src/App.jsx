import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'qapi_dashboard_v1'

const defaultPresets = [
  {
    id: 'rest-jsonplaceholder-posts',
    name: 'JSONPlaceholder: List Posts',
    type: 'REST',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: '{\n  "accept": "application/json"\n}',
    query: '',
    body: ''
  },
  {
    id: 'rest-jsonplaceholder-create',
    name: 'JSONPlaceholder: Create Post',
    type: 'REST',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: '{\n  "content-type": "application/json"\n}',
    query: '',
    body: '{\n  "title": "QA demo",\n  "body": "Testing create flow",\n  "userId": 7\n}'
  },
  {
    id: 'rest-httpbin-delay',
    name: 'httpbin: Delayed Response',
    type: 'REST',
    method: 'GET',
    url: 'https://httpbin.org/delay/2',
    headers: '{\n  "accept": "application/json"\n}',
    query: '',
    body: ''
  },
  {
    id: 'graphql-countries',
    name: 'Countries GraphQL: Country List',
    type: 'GraphQL',
    method: 'POST',
    url: 'https://countries.trevorblades.com/',
    headers: '{\n  "content-type": "application/json"\n}',
    query: '',
    graphqlQuery: 'query GetCountries {\n  countries {\n    code\n    name\n    emoji\n    capital\n  }\n}',
    graphqlVariables: '{}'
  },
  {
    id: 'ws-postman-echo',
    name: 'Postman Echo: WebSocket',
    type: 'WebSocket',
    method: 'CONNECT',
    url: 'wss://ws.postman-echo.com/raw',
    headers: '',
    query: '',
    wsMessage: 'hello websocket'
  }
]

const defaultAuth = {
  bearerToken: '',
  apiKeyName: 'x-api-key',
  apiKeyValue: ''
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function normalizeHeaders(value) {
  if (!value) return {}
  const parsed = safeJsonParse(value, {})
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed
  }
  return {}
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    const stored = window.localStorage.getItem(key)
    if (!stored) return initialValue
    try {
      return JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function App() {
  const [store, setStore] = useLocalStorageState(STORAGE_KEY, {
    presets: defaultPresets,
    auth: defaultAuth
  })
  const [activeId, setActiveId] = useState(store.presets[0]?.id || '')
  const [response, setResponse] = useState(null)
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [monitoring, setMonitoring] = useState({})
  const [lastPing, setLastPing] = useState({})
  const [livePreview, setLivePreview] = useState(true)
  const wsRef = useRef(null)
  const wsLogRef = useRef([])

  const activePreset = useMemo(() => {
    return store.presets.find((preset) => preset.id === activeId) || store.presets[0]
  }, [activeId, store.presets])

  useEffect(() => {
    if (!activeId && store.presets[0]) {
      setActiveId(store.presets[0].id)
    }
  }, [activeId, store.presets])

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(monitoring).forEach(([id, enabled]) => {
        if (!enabled) return
        const preset = store.presets.find((item) => item.id === id)
        if (!preset) return
        if (preset.type === 'WebSocket') return
        runRequest(preset, { silent: true })
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [monitoring, store.presets])

  const updatePreset = (updates) => {
    setStore((current) => ({
      ...current,
      presets: current.presets.map((preset) =>
        preset.id === activePreset.id ? { ...preset, ...updates } : preset
      )
    }))
  }

  const addPreset = () => {
    const id = `rest-${Date.now()}`
    const next = {
      id,
      name: 'New REST Request',
      type: 'REST',
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      headers: '{\n  "accept": "application/json"\n}',
      query: '',
      body: ''
    }
    setStore((current) => ({
      ...current,
      presets: [next, ...current.presets]
    }))
    setActiveId(id)
  }

  const deletePreset = (id) => {
    setStore((current) => {
      const nextPresets = current.presets.filter((preset) => preset.id !== id)
      if (activeId === id) {
        setActiveId(nextPresets[0]?.id || '')
      }
      return {
        ...current,
        presets: nextPresets
      }
    })
  }

  const runRequest = async (preset = activePreset, options = {}) => {
    if (!preset?.url) return
    const start = performance.now()
    setIsLoading(!options.silent)

    const includeBearer = preset.includeBearer ?? true
    const includeApiKey = preset.includeApiKey ?? false

    const baseHeaders = normalizeHeaders(preset.headers)
    const headers = {
      ...baseHeaders
    }

    if (includeBearer && store.auth.bearerToken) {
      headers.Authorization = `Bearer ${store.auth.bearerToken}`
    }

    if (includeApiKey && store.auth.apiKeyName && store.auth.apiKeyValue) {
      headers[store.auth.apiKeyName] = store.auth.apiKeyValue
    }

    let url = preset.url.trim()
    if (preset.query) {
      const queryString = preset.query
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => (line.includes('=') ? line : `${line}=`))
        .join('&')
      if (queryString) {
        url += url.includes('?') ? `&${queryString}` : `?${queryString}`
      }
    }

    const fetchOptions = {
      method: preset.method || 'GET',
      headers
    }

    if (preset.type === 'GraphQL') {
      fetchOptions.method = 'POST'
      fetchOptions.body = JSON.stringify({
        query: preset.graphqlQuery || '',
        variables: safeJsonParse(preset.graphqlVariables || '{}', {})
      })
      if (!headers['content-type']) {
        fetchOptions.headers['content-type'] = 'application/json'
      }
    } else if (preset.type === 'REST' && !['GET', 'HEAD'].includes(fetchOptions.method)) {
      if (preset.body) {
        fetchOptions.body = preset.body
      }
      if (!headers['content-type'] && preset.body) {
        fetchOptions.headers['content-type'] = 'application/json'
      }
    }

    try {
      const res = await fetch(url, fetchOptions)
      const duration = Math.round(performance.now() - start)
      const text = await res.text()
      const contentType = res.headers.get('content-type') || ''
      const parsed = contentType.includes('application/json') ? safeJsonParse(text, text) : text
      const entry = {
        id: `${preset.id}-${Date.now()}`,
        name: preset.name,
        type: preset.type,
        status: res.status,
        ok: res.ok,
        duration,
        timestamp: new Date().toISOString(),
        body: parsed,
        raw: text,
        headers: Object.fromEntries(res.headers.entries()),
        url
      }

      if (options.silent) {
        setLastPing((current) => ({
          ...current,
          [preset.id]: {
            status: res.status,
            duration,
            timestamp: entry.timestamp,
            ok: res.ok
          }
        }))
      } else {
        setResponse(entry)
        setHistory((current) => [entry, ...current].slice(0, 20))
      }
    } catch (error) {
      const duration = Math.round(performance.now() - start)
      const entry = {
        id: `${preset.id}-${Date.now()}`,
        name: preset.name,
        type: preset.type,
        status: 'ERR',
        ok: false,
        duration,
        timestamp: new Date().toISOString(),
        body: String(error),
        raw: String(error),
        headers: {},
        url
      }
      if (options.silent) {
        setLastPing((current) => ({
          ...current,
          [preset.id]: {
            status: 'ERR',
            duration,
            timestamp: entry.timestamp,
            ok: false
          }
        }))
      } else {
        setResponse(entry)
        setHistory((current) => [entry, ...current].slice(0, 20))
      }
    } finally {
      if (!options.silent) setIsLoading(false)
    }
  }

  const connectWebSocket = () => {
    if (!activePreset?.url) return
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    const socket = new WebSocket(activePreset.url)
    wsRef.current = socket
    wsLogRef.current = []

    socket.addEventListener('open', () => {
      wsLogRef.current = [
        { type: 'system', message: 'WebSocket connected', timestamp: new Date().toISOString() }
      ]
      setResponse({
        id: `ws-${Date.now()}`,
        name: activePreset.name,
        type: 'WebSocket',
        status: 'OPEN',
        ok: true,
        duration: 0,
        timestamp: new Date().toISOString(),
        body: wsLogRef.current,
        raw: '',
        headers: {},
        url: activePreset.url
      })
    })

    socket.addEventListener('message', (event) => {
      wsLogRef.current = [
        { type: 'message', message: event.data, timestamp: new Date().toISOString() },
        ...wsLogRef.current
      ]
      setResponse((current) => ({
        ...current,
        body: wsLogRef.current
      }))
    })

    socket.addEventListener('close', () => {
      wsLogRef.current = [
        { type: 'system', message: 'WebSocket closed', timestamp: new Date().toISOString() },
        ...wsLogRef.current
      ]
      setResponse((current) => ({
        ...current,
        status: 'CLOSED',
        ok: false,
        body: wsLogRef.current
      }))
    })

    socket.addEventListener('error', () => {
      wsLogRef.current = [
        { type: 'system', message: 'WebSocket error', timestamp: new Date().toISOString() },
        ...wsLogRef.current
      ]
      setResponse((current) => ({
        ...current,
        status: 'ERROR',
        ok: false,
        body: wsLogRef.current
      }))
    })
  }

  const sendWebSocketMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    if (!activePreset?.wsMessage) return
    wsRef.current.send(activePreset.wsMessage)
    wsLogRef.current = [
      { type: 'sent', message: activePreset.wsMessage, timestamp: new Date().toISOString() },
      ...wsLogRef.current
    ]
    setResponse((current) => ({
      ...current,
      body: wsLogRef.current
    }))
  }

  const authBadge = () => {
    const badges = []
    if (store.auth.bearerToken) badges.push('Bearer')
    if (store.auth.apiKeyValue) badges.push('API Key')
    return badges.length ? badges.join(' + ') : 'No Auth'
  }

  const requestSummary = () => {
    if (!activePreset) return 'No request selected'
    if (activePreset.type === 'WebSocket') return `WS ${activePreset.url}`
    if (activePreset.type === 'GraphQL') return `GraphQL POST ${activePreset.url}`
    return `${activePreset.method || 'GET'} ${activePreset.url}`
  }

  return (
    <div className="app">
      <div className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Portfolio Demo</p>
          <h1>QAPI Live Console</h1>
          <p className="hero-sub">
            Monitor, execute, and demo REST, GraphQL, and WebSocket calls with live telemetry.
            Built to showcase QA workflows, auth variations, and protocol coverage in one place.
          </p>
          <div className="hero-stats">
            <div>
              <span>Protocols</span>
              <strong>REST · GraphQL · WS</strong>
            </div>
            <div>
              <span>Auth Layer</span>
              <strong>{authBadge()}</strong>
            </div>
            <div>
              <span>Active Request</span>
              <strong>{requestSummary()}</strong>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-top">
            <span>Monitoring</span>
            <button type="button" className="ghost" onClick={addPreset}>
              + Add Request
            </button>
          </div>
          <div className="monitor-grid">
            {store.presets.slice(0, 4).map((preset) => {
              const last = lastPing[preset.id]
              const isOn = monitoring[preset.id]
              return (
                <div key={preset.id} className="monitor-card">
                  <div>
                    <p>{preset.name}</p>
                    <span>{preset.type}</span>
                  </div>
                  <div className={`status-pill ${last?.ok ? 'ok' : last ? 'warn' : ''}`}>
                    {last?.status || '—'}
                  </div>
                  <div className="monitor-meta">
                    <span>{last ? formatDuration(last.duration) : 'No ping'}</span>
                    <span>{last ? new Date(last.timestamp).toLocaleTimeString() : ''}</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={Boolean(isOn)}
                      onChange={() =>
                        setMonitoring((current) => ({
                          ...current,
                          [preset.id]: !current[preset.id]
                        }))
                      }
                    />
                    <span>Monitor</span>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="layout">
        <section className="panel presets">
          <div className="panel-header">
            <h2>Request Library</h2>
            <button type="button" className="ghost" onClick={addPreset}>
              + New
            </button>
          </div>
          <div className="preset-list">
            {store.presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`preset-item ${preset.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(preset.id)}
              >
                <div>
                  <span className="preset-type">{preset.type}</span>
                  <strong>{preset.name}</strong>
                  <small>{preset.url}</small>
                </div>
                <span className="preset-method">{preset.method}</span>
              </button>
            ))}
          </div>
          <div className="panel-footer">
            <p>Store tokens locally for quick demos.</p>
            <div className="auth-block">
              <label>
                Bearer token
                <input
                  value={store.auth.bearerToken}
                  onChange={(event) =>
                    setStore((current) => ({
                      ...current,
                      auth: { ...current.auth, bearerToken: event.target.value }
                    }))
                  }
                  placeholder="paste token"
                />
              </label>
              <div className="auth-split">
                <label>
                  API key header
                  <input
                    value={store.auth.apiKeyName}
                    onChange={(event) =>
                      setStore((current) => ({
                        ...current,
                        auth: { ...current.auth, apiKeyName: event.target.value }
                      }))
                  }
                />
                </label>
                <label>
                  API key value
                  <input
                    value={store.auth.apiKeyValue}
                    onChange={(event) =>
                      setStore((current) => ({
                        ...current,
                        auth: { ...current.auth, apiKeyValue: event.target.value }
                      }))
                  }
                />
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="panel builder">
          <div className="panel-header">
            <h2>Request Builder</h2>
            <div className="header-actions">
              <button
                type="button"
                className="ghost"
                onClick={() => deletePreset(activePreset.id)}
              >
                Delete
              </button>
              <button
                type="button"
                className="primary"
                onClick={() =>
                  activePreset.type === 'WebSocket' ? connectWebSocket() : runRequest()
                }
                disabled={isLoading}
              >
                {activePreset.type === 'WebSocket' ? 'Connect' : isLoading ? 'Running…' : 'Run'}
              </button>
            </div>
          </div>

          <div className="form">
            <div className="field-row">
              <label>
                Name
                <input
                  value={activePreset.name}
                  onChange={(event) => updatePreset({ name: event.target.value })}
                />
              </label>
              <label>
                Type
                <select
                  value={activePreset.type}
                  onChange={(event) => updatePreset({ type: event.target.value })}
                >
                  <option value="REST">REST</option>
                  <option value="GraphQL">GraphQL</option>
                  <option value="WebSocket">WebSocket</option>
                </select>
              </label>
              <label>
                Method
                <select
                  value={activePreset.method}
                  onChange={(event) => updatePreset({ method: event.target.value })}
                  disabled={activePreset.type !== 'REST'}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>PATCH</option>
                  <option>DELETE</option>
                </select>
              </label>
            </div>

            <label>
              Endpoint URL
              <input
                value={activePreset.url}
                onChange={(event) => updatePreset({ url: event.target.value })}
              />
            </label>

            {activePreset.type === 'REST' && (
              <div className="field-row">
                <label>
                  Query params (key=value)
                  <textarea
                    rows="3"
                    value={activePreset.query}
                    onChange={(event) => updatePreset({ query: event.target.value })}
                    placeholder="status=active\nlimit=10"
                  />
                </label>
                <label>
                  Headers (JSON)
                  <textarea
                    rows="3"
                    value={activePreset.headers}
                    onChange={(event) => updatePreset({ headers: event.target.value })}
                  />
                </label>
              </div>
            )}

            {activePreset.type === 'REST' && (
              <label>
                Body (raw)
                <textarea
                  rows="6"
                  value={activePreset.body}
                  onChange={(event) => updatePreset({ body: event.target.value })}
                />
              </label>
            )}

            {activePreset.type === 'GraphQL' && (
              <>
                <div className="field-row">
                  <label>
                    Headers (JSON)
                    <textarea
                      rows="3"
                      value={activePreset.headers}
                      onChange={(event) => updatePreset({ headers: event.target.value })}
                    />
                  </label>
                  <label>
                    Variables (JSON)
                    <textarea
                      rows="3"
                      value={activePreset.graphqlVariables || '{}'}
                      onChange={(event) => updatePreset({ graphqlVariables: event.target.value })}
                    />
                  </label>
                </div>
                <label>
                  GraphQL Query
                  <textarea
                    rows="8"
                    value={activePreset.graphqlQuery}
                    onChange={(event) => updatePreset({ graphqlQuery: event.target.value })}
                  />
                </label>
              </>
            )}

            {activePreset.type === 'WebSocket' && (
              <>
                <div className="field-row">
                  <label>
                    Message
                    <input
                      value={activePreset.wsMessage || ''}
                      onChange={(event) => updatePreset({ wsMessage: event.target.value })}
                    />
                  </label>
                  <label>
                    Live preview
                    <select
                      value={livePreview ? 'on' : 'off'}
                      onChange={(event) => setLivePreview(event.target.value === 'on')}
                    >
                      <option value="on">On</option>
                      <option value="off">Off</option>
                    </select>
                  </label>
                </div>
                <div className="button-row">
                  <button type="button" className="ghost" onClick={connectWebSocket}>
                    Reconnect
                  </button>
                  <button type="button" className="primary" onClick={sendWebSocketMessage}>
                    Send Message
                  </button>
                </div>
              </>
            )}

            <div className="toggles">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={Boolean(activePreset.includeBearer ?? true)}
                  onChange={() =>
                    updatePreset({ includeBearer: !(activePreset.includeBearer ?? true) })
                  }
                />
                <span>Include Bearer</span>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={Boolean(activePreset.includeApiKey)}
                  onChange={() => updatePreset({ includeApiKey: !activePreset.includeApiKey })}
                />
                <span>Include API Key</span>
              </label>
            </div>
          </div>
        </section>

        <section className="panel response">
          <div className="panel-header">
            <h2>Response</h2>
            <div className="header-actions">
              <button
                type="button"
                className="ghost"
                onClick={() => setResponse(null)}
              >
                Clear
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => response && navigator.clipboard.writeText(JSON.stringify(response.body, null, 2))}
                disabled={!response}
              >
                Copy JSON
              </button>
            </div>
          </div>

          <div className="response-body">
            {response ? (
              <>
                <div className="response-meta">
                  <span className={`status-pill ${response.ok ? 'ok' : 'warn'}`}>
                    {response.status}
                  </span>
                  <span>{formatDuration(response.duration)}</span>
                  <span>{new Date(response.timestamp).toLocaleString()}</span>
                  <span className="muted">{response.url}</span>
                </div>
                <pre>
                  {activePreset.type === 'WebSocket' && !livePreview
                    ? 'Live preview disabled.'
                    : JSON.stringify(response.body, null, 2)}
                </pre>
              </>
            ) : (
              <div className="empty">Run a request to see the response payload.</div>
            )}
          </div>

          <div className="panel-header">
            <h2>History</h2>
            <span className="muted">Last 20 requests</span>
          </div>
          <div className="history">
            {history.length === 0 && <div className="empty">No requests yet.</div>}
            {history.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="history-item"
                onClick={() => setResponse(entry)}
              >
                <div>
                  <strong>{entry.name}</strong>
                  <span>{entry.type}</span>
                </div>
                <div>
                  <span className={`status-pill ${entry.ok ? 'ok' : 'warn'}`}>
                    {entry.status}
                  </span>
                  <span>{formatDuration(entry.duration)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
