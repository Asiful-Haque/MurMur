import { useState, useEffect } from 'react'
import React from 'react'
import '../styles/Timeline.css'
import MurmurCard from '../components/Murmurcard'

const Timeline = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const demoData = {
    page: 1,
    hasMore: true,
    murmurs: [
      {
        id: '1',
        content: 'This is the first demo murmur.',
        createdAt: '2025-06-22T12:00:00Z',
        user: { id: '1', name: 'Alice' },
      },
      {
        id: '2',
        content: 'Another murmur in demo data.',
        createdAt: '2025-06-22T12:05:00Z',
        user: { id: '2', name: 'Bob' },
      },
      {
        id: '1',
        content: 'This is the first demo murmur.',
        createdAt: '2025-06-22T12:00:00Z',
        user: { id: '3', name: 'Alice' },
      },
      {
        id: '2',
        content: 'Another murmur in demo data.',
        createdAt: '2025-06-22T12:05:00Z',
        user: { id: '2', name: 'Bob' },
      },
      {
        id: '1',
        content: 'This is the first demo murmur.',
        createdAt: '2025-06-22T12:00:00Z',
        user: { id: '1', name: 'Alice' },
      },
      {
        id: '2',
        content: 'Another murmur in demo data.',
        createdAt: '2025-06-22T12:05:00Z',
        user: { id: '2', name: 'Bob' },
      },
    ],
  }

  const loadTimeline = async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true)
      else setLoadingMore(true)

      const result = demoData

      if (append && data) {
        setData({
          ...result,
          murmurs: [...data.murmurs, ...result.murmurs],
        })
      } else {
        setData(result)
      }
    } catch (error) {
      console.error('Failed to load timeline:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadTimeline()
  }, [])

  const handleLoadMore = () => {
    if (data?.hasMore) {
      loadTimeline(data.page + 1, true)
    }
  }

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-center">
          <div className="spinner"></div>
          <p className="loading-text">Loading timeline...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="site-header">
        <h1 className="site-title">Murmur</h1>
        <p className="site-tagline">Your thoughts, out loud.</p>
      </header>

      <div className="timeline-container">
        <div className="timeline-header">
          <h2 className="timeline-title">Timeline</h2>
          <p className="timeline-subtitle">See what's happening now</p>
        </div>

        <div className="murmur-list">
          {data?.murmurs.map((murmur, index) => (
            <MurmurCard key={murmur.id} murmur={murmur} index={index} />
          ))}
        </div>

        {data?.hasMore && (
          <div className="load-more-wrapper">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="load-more-button"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {data && !data.hasMore && data.murmurs.length > 0 && (
          <div className="end-message">
            <p>You've caught up with all murmurs!</p>
          </div>
        )}
      </div>

      <footer className="site-footer">
        <p>© 2025 Murmur. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Timeline
