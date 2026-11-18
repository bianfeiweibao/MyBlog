import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAccount, registerAccount } from '../api/auth'

export default function Login() {
  const [mode, setMode] = useState('login') //'login' or 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const isLogin = mode === 'login'

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value }) //计算属性名
  }
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      if (!isLogin) {
        await registerAccount({
          username: form.username,
          email: form.email,
          password: form.password
        })
      }
      const res = await loginAccount({
        username: form.username,
        password: form.password,
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.user.username)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '请求失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <div className="auth-form">
        <h1>{isLogin ? '登录' : '注册'}</h1>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>用户名</label>
            <input
              name='username'
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label>邮箱</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>密码</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className='auth-submit' disabled={loading}>
            {loading ? '提交中...' : isLogin ? '登录' : '注册并登录'}
          </button>

          <p className="auth-switch">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              type="button"
              onClick={() => {
                setMode(isLogin ? 'register' : 'login')
                setError('')
              }}
            >
              {isLogin ? '去注册' : '去登录'}
            </button>
          </p>
        </form>
      </div>
    </section>
  )
}