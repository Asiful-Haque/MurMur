import { useState, useEffect } from 'react'
import React from 'react'
import '../styles/Timeline.css'
import MurmurCard from '../components/Murmurcard'

const Timeline = () => {
  const currentUserId = 1 // as not logged in

  const [data, setData] = useState<{
    page: number
    hasMore: boolean
    murmurs: any[]
    total: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMurmur, setNewMurmur] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  const limit = 10

  const loadTimeline = async (page = 1) => {
    try {
      setLoading(true)

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
      const totalPages = Math.ceil(result.total / limit)

      setData({
        page,
        hasMore,
        murmurs: mappedMurmurs,
        total: totalPages,
      })
    } catch (error) {
      console.error('Failed to load timeline:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTimeline(1)
  }, [])

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

      if (!res.ok) throw new Error('Failed to post murmur')

      setNewMurmur('')
      loadTimeline(1)
    } catch (error: any) {
      setPostError(error.message || 'Error posting murmur')
    } finally {
      setPosting(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (
      data &&
      newPage !== data.page &&
      newPage >= 1 &&
      newPage <= data.total
    ) {
      loadTimeline(newPage)
    }
  }

  const renderPagination = () => {
    if (!data || data.total <= 1) return null

    const pagesToShow = 5
    const start = Math.max(1, data.page - Math.floor(pagesToShow / 2))
    const end = Math.min(start + pagesToShow - 1, data.total)

    const pageNumbers: number[] = []
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(data.page - 1)}
          disabled={data.page === 1}
          className="pagination-button"
        >
          Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`pagination-number ${num === data.page ? 'active' : ''}`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(data.page + 1)}
          disabled={data.page === data.total}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    )
  }

  if (loading && !data) {
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

        {renderPagination()}
      </div>

      <footer className="site-footer">
        <p>© 2025 Murmur. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Timeline
