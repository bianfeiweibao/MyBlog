import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import userAvatar from '../assets/image.jpg'

export default function Profile() {
  const token = localStorage.getItem('token')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    async function fetchUser() {
      try {
        const res = await getCurrentUser()
        setUser(res.data)
      } catch (err) {
        setError(err.response?.data?.error || '获取用户信息失败')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [token])

  if (!token) return <Navigate to="/login" replace />

  if (loading) {
    return <section className="page"><p>加载中...</p></section>
  }

  if (error) {
    return <section className="page"><p>{error}</p></section>
  }

  return (
    <section className="page">
      <div className="profile-card">
        <img className="profile-avatar" src={userAvatar} alt={user.username} />
        <h1>{user.username}</h1>
        <p className="profile-email">{user.email}</p>
      </div>
    </section>
  )
}