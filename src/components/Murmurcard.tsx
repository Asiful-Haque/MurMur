
import React, { useState } from 'react'
import '../styles/Murmur.css'



const MurmurCard = ({ murmur, index, showDelete = false, onDelete }: any) => {
  const [liked, setLiked] = useState(false)

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
          onClick={(e) => {
            e.preventDefault()
            setLiked(!liked)
          }}
        >
          ❤️ {liked ? 'Liked' : 'Like'}
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
