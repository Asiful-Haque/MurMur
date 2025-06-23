import { useEffect, useState } from 'react'
import '../styles/Profile.css'
import React from 'react'
import MurmurCard from '../components/Murmurcard'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const { userId } = useParams<{ userId: string }>()
  const currentUserId = 1 // As no login done..so , logged in user is 1 (assumed)

  const [user, setUser] = useState({
    email: '',
    username: '',
    id: 0,
  })
  const bio = 'Making the world amazing with being polite';

  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [murmurs, setMurmurs] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (!userId) return

    const fetchProfileData = async () => {
      try {
        // ✅ Fetch user data from your API
        const userRes = await fetch(
          `http://localhost:3001/api/me/murmurs/userprofile/${userId}`,
        )
        const userData = await userRes.json()
        console.log("Dat", userData);

        // ✅ Fetch follower, following and murmurs
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

      // Refresh follower count
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
            <h1 className="profile-name">@{user.username}</h1>
            <p className="profile-username">{user.email}</p>
            <p className="profile-bio">{bio}</p>
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

        <h2 className="profile-murmur-title">Murmurs by {user.username}</h2>

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
                user: { id: user.id, name: user.username },
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
