import React, { useEffect, useState } from 'react'
import '../styles/Murmur.css'

const MurmurCard = ({ murmur, index, showDelete = false, onDelete }: any) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/me/murmurs/likes/${murmur.id}`,
        )
        const data = await res.json()
        setLikeCount(data.result?.count || 0) 
      } catch (err) {
        console.error('Failed to load like count:', err)
      }
    }

    fetchLikeCount()
  }, [murmur.id])

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    const newLiked = !liked
    setLiked(newLiked)

    try {
      const method = newLiked ? 'POST' : 'DELETE'

      await fetch(`http://localhost:3001/api/me/murmurs/like/${murmur.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 1 }), // as i am not logged in ..so user = 1
      })

      setLikeCount((prev) => prev + (newLiked ? 1 : -1))
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  return (
    <div className="murmur-card">
      <div className="murmur-header">
        <a href={`/profile/${murmur.user.id}`} className="avatar-link">
          <img
            src={`https://i.pravatar.cc/50?img=${(index % 70) + 1}`}
            alt="User Avatar"
            className="avatar"
          />
        </a>

        <div className="user-info">
          <a
            href={`/profile/${murmur.user.id}`}
            className="murmur-link-wrapper"
          >
            <span className="murmur-username">{murmur.user.name}</span>
          </a>
          <span className="murmur-date">
            {new Date(murmur.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <p className="murmur-content">{murmur.content}</p>

      <div className="murmur-actions">
        <button
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleLikeToggle}
        >
          ❤️ {liked ? 'Liked' : 'Like'} ({likeCount})
        </button>

        {showDelete && (
          <button
            className="delete-button"
            onClick={(e) => {
              e.preventDefault()
              onDelete?.()
            }}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default MurmurCard
