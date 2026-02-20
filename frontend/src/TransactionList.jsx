import { useEffect, useState } from 'react'
import { formatEther } from 'ethers'
import './TransactionList.css'

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || ''
const ETHERSCAN_MAX_BLOCK = 99999999

function shortenHash(hash) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`
}

function formatTimestamp(ts) {
  const date = new Date(Number(ts) * 1000)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatValue(valueWei) {
  try {
    const eth = parseFloat(formatEther(BigInt(valueWei)))
    return eth.toFixed(eth < 0.0001 ? 8 : 6)
  } catch {
    return '—'
  }
}

function shortenAddr(addr) {
  if (!addr) return '—'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export default function TransactionList({ address }) {
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!address) return

    const fetchTxs = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiKey = ETHERSCAN_API_KEY
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=${ETHERSCAN_MAX_BLOCK}&page=1&offset=20&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data.status === '0' && data.message !== 'No transactions found') {
          throw new Error(data.result || 'Etherscan API error')
        }
        setTxs(Array.isArray(data.result) ? data.result : [])
      } catch (err) {
        setError(err?.message ?? 'Failed to fetch transactions.')
      } finally {
        setLoading(false)
      }
    }

    fetchTxs()
  }, [address])

  return (
    <div className="tx-section">
      <h2 className="tx-title">Recent Transactions</h2>

      {loading && (
        <div className="tx-state">
          <div className="spinner" aria-label="Loading transactions" />
          <p>Loading transactions…</p>
        </div>
      )}

      {!loading && error && (
        <div className="tx-state tx-error">
          <span className="tx-state-icon">⚠</span>
          <p>{error}</p>
          {!ETHERSCAN_API_KEY && (
            <p className="tx-hint">
              Add a <code>VITE_ETHERSCAN_API_KEY</code> to your{' '}
              <code>.env</code> file to avoid rate limits.
            </p>
          )}
        </div>
      )}

      {!loading && !error && txs.length === 0 && (
        <div className="tx-state">
          <span className="tx-state-icon">📭</span>
          <p>No transactions found for this address.</p>
        </div>
      )}

      {!loading && !error && txs.length > 0 && (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Value (ETH)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((tx) => {
                const isOut = tx.from?.toLowerCase() === address.toLowerCase()
                const statusOk = tx.isError === '0'
                return (
                  <tr key={tx.hash}>
                    <td>
                      <a
                        className="tx-hash-link"
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        title={tx.hash}
                      >
                        {shortenHash(tx.hash)}
                      </a>
                    </td>
                    <td className="tx-date">{formatTimestamp(tx.timeStamp)}</td>
                    <td>
                      <span
                        className={`tx-addr ${isOut ? 'tx-out' : 'tx-in'}`}
                        title={tx.from}
                      >
                        {shortenAddr(tx.from)}
                      </span>
                    </td>
                    <td>
                      <span className="tx-addr" title={tx.to}>
                        {tx.to ? shortenAddr(tx.to) : <em>Contract Create</em>}
                      </span>
                    </td>
                    <td className="tx-value">
                      {formatValue(tx.value)} ETH
                    </td>
                    <td>
                      <span className={`tx-badge ${statusOk ? 'tx-badge-ok' : 'tx-badge-fail'}`}>
                        {statusOk ? 'Success' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
