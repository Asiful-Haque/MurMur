import { useEffect, useState } from 'react'
import '../styles/Profile.css'
import React from 'react'
import MurmurCard from '../components/Murmurcard'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const { userId } = useParams<{ userId: string }>()
  const currentUserId = 1 // Replace with actual logged-in user ID
  const [user, setUser] = useState({
    name: '',
    username: '',
    bio: '',
    id: 0,
  })
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [murmurs, setMurmurs] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (!userId) return

    const fetchProfileData = async () => {
      try {
        const userData = {
          id: parseInt(userId),
          name: 'Demo User',
          username: 'demo_user',
          bio: 'Just a passionate developer sharing random thoughts in the digital void.',
        }

        const [followedRes, followingRes, murmursRes] = await Promise.all([
          fetch(`http://localhost:3001/api/follow/count/followed/${userId}`),
          fetch(`http://localhost:3001/api/follow/count/following/${userId}`),
          fetch(`http://localhost:3001/api/me/murmurs/usersmurmurs/${userId}`),
        ])

        const followedData = await followedRes.json()
        const followingData = await followingRes.json()
        const murmursData = await murmursRes.json()

        setUser(userData)
        setFollowers(followedData.followedCount || 0)
        setFollowing(followingData.followCount || 0)
        setMurmurs(murmursData || [])

        if (currentUserId !== userData.id) {
          const followStatus = await fetch(
            `http://localhost:3001/api/follow/is-following/${currentUserId}/${userData.id}`,
          )
          const { isFollowing } = await followStatus.json()
          setIsFollowing(isFollowing)
        }
      } catch (error) {
        console.error('Failed to load profile data:', error)
      }
    }

    fetchProfileData()
  }, [userId])

  const handleDelete = async (murmurId: number) => {
    try {
      await fetch(`http://localhost:3001/api/me/murmurs/${murmurId}`, {
        method: 'DELETE',
      })

      setMurmurs((prev) => prev.filter((m) => m.id !== murmurId))
    } catch (error) {
      console.error('Failed to delete murmur:', error)
    }
  }

  const handleFollowToggle = async () => {
    try {
      const method = isFollowing ? 'DELETE' : 'POST'

      await fetch('http://localhost:3001/api/follow', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: currentUserId,
          followeeId: user.id,
        }),
      })

      setIsFollowing(!isFollowing)

      // Refresh follower count from backend
      const followedRes = await fetch(
        `http://localhost:3001/api/follow/count/followed/${user.id}`,
      )
      const followedData = await followedRes.json()
      setFollowers(followedData.followedCount || 0)
    } catch (err) {
      console.error('Follow/unfollow failed:', err)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-banner"></div>

      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-bio">{user.bio}</p>
            <div className="profile-stats-with-button">
              <div className="profile-stats">
                <span>
                  <strong>{following}</strong> Following
                </span>
                <span>
                  <strong>{followers}</strong> Followers
                </span>
              </div>
              {user.id !== currentUserId && (
                <button
                  className={`follow-button ${isFollowing ? 'unfollow' : 'follow'}`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        <h2 className="profile-murmur-title">Murmurs by {user.name}</h2>

        <div className="profile-murmurs">
          {murmurs.map((murmur: any, index: number) => (
            <MurmurCard
              key={murmur.id}
              index={index}
              showDelete={true}
              onDelete={() => handleDelete(murmur.id)}
              murmur={{
                id: murmur.id,
                content: murmur.content,
                createdAt: murmur.created_at,
                user: { id: user.id, name: user.name },
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
