import { useState, useCallback } from 'react'
import { BrowserProvider, formatEther } from 'ethers'
import TransactionList from './TransactionList'
import './App.css'

function shortenAddress(addr) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function App() {
  const [account, setAccount] = useState(null)
  const [ensName, setEnsName] = useState(null)
  const [balance, setBalance] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it from metamask.io.')
      return
    }
    setConnecting(true)
    setError(null)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0]

      // Fetch balance
      const rawBalance = await provider.getBalance(address)
      setBalance(formatEther(rawBalance))

      // Attempt ENS lookup
      try {
        const name = await provider.lookupAddress(address)
        setEnsName(name)
      } catch {
        setEnsName(null)
      }

      setAccount(address)
    } catch (err) {
      setError(err?.message ?? 'Failed to connect wallet.')
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setEnsName(null)
    setBalance(null)
    setError(null)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">Crypto Wallet Manager</span>
          </div>
          {account ? (
            <button className="btn btn-secondary" onClick={disconnect}>
              Disconnect
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={connect}
              disabled={connecting}
            >
              {connecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠</span>
            {error}
          </div>
        )}

        {!account ? (
          <div className="hero">
            <div className="hero-icon">◈</div>
            <h1 className="hero-title">Track Your Ethereum Wallet</h1>
            <p className="hero-subtitle">
              Connect your MetaMask wallet to view your balance and recent
              transaction history on Ethereum mainnet.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={connect}
              disabled={connecting}
            >
              {connecting ? 'Connecting…' : 'Connect MetaMask'}
            </button>
            {!window.ethereum && (
              <p className="hint">
                Don&apos;t have MetaMask?{' '}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Install it here →
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="dashboard">
            <div className="cards-row">
              <div className="card">
                <p className="card-label">Connected Address</p>
                <p className="card-value address-value">
                  {ensName ? (
                    <>
                      <span className="ens-name">{ensName}</span>
                      <span className="address-short">
                        {shortenAddress(account)}
                      </span>
                    </>
                  ) : (
                    <span className="address-shortened">{shortenAddress(account)}</span>
                  )}
                </p>
                <a
                  className="card-link"
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Etherscan ↗
                </a>
              </div>

              <div className="card card-accent">
                <p className="card-label">ETH Balance</p>
                <p className="card-value balance-value">
                  {balance !== null
                    ? `${parseFloat(balance).toFixed(6)} ETH`
                    : '—'}
                </p>
              </div>
            </div>

            <TransactionList address={account} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Powered by{' '}
          <a
            href="https://etherscan.io"
            target="_blank"
            rel="noreferrer"
          >
            Etherscan
          </a>{' '}
          &amp;{' '}
          <a href="https://metamask.io" target="_blank" rel="noreferrer">
            MetaMask
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
