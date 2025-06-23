import { useState, useEffect } from 'react'
import React from 'react'
import '../styles/Timeline.css'
import MurmurCard from '../components/Murmurcard'

const Timeline = () => {
  const currentUserId = 1 // Replace this with your actual user ID from auth/session

  const [data, setData] = useState<{
    page: number
    hasMore: boolean
    murmurs: any[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [newMurmur, setNewMurmur] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  const limit = 6 // items per page

  const loadTimeline = async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true)
      else setLoadingMore(true)

      const res = await fetch(
        `http://localhost:3001/api/timeline?page=${page}&limit=${limit}`,
      )
      if (!res.ok) throw new Error('Failed to fetch timeline')

      const result = await res.json()

      const mappedMurmurs = result.data.map((murmur: any) => ({
        id: murmur.id,
        content: murmur.content,
        createdAt: murmur.created_at,
        user: {
          id: murmur.user_id,
          name: murmur.username,
        },
      }))

      const hasMore = page * limit < result.total

      if (append && data) {
        setData({
          page,
          hasMore,
          murmurs: [...data.murmurs, ...mappedMurmurs],
        })
      } else {
        setData({
          page,
          hasMore,
          murmurs: mappedMurmurs,
        })
      }
    } catch (error) {
      console.error('Failed to load timeline:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadTimeline(1)
  }, [])

  const handleLoadMore = () => {
    if (data?.hasMore) {
      loadTimeline(data.page + 1, true)
    }
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMurmur.trim()) return

    setPosting(true)
    setPostError(null)

    try {
      const res = await fetch('http://localhost:3001/api/me/murmurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          content: newMurmur.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to post murmur')
      }

      setNewMurmur('')
      await loadTimeline(1)
    } catch (error: any) {
      setPostError(error.message || 'Error posting murmur')
    } finally {
      setPosting(false)
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
        <form onSubmit={handleSubmit} className="new-murmur-form">
          <textarea
            value={newMurmur}
            onChange={(e) => setNewMurmur(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            disabled={posting}
            className="new-murmur-textarea"
          />
          <button
            type="submit"
            disabled={posting || !newMurmur.trim()}
            className="post-murmur-button"
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
          {postError && <p className="error-text">{postError}</p>}
        </form>

        <div className="timeline-header">
          <h2 className="timeline-title">Timeline</h2>
          <p className="timeline-subtitle">See what's happening now</p>
        </div>

        <div className="murmur-list">
          {data?.murmurs.map((murmur, index) => (
            <MurmurCard
              key={`${murmur.id}-${index}`}
              murmur={murmur}
              index={index}
            />
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
