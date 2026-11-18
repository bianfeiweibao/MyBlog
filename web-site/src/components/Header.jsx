import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import avatar from '../assets/avatar.jpg'
import userAvatar from '../assets/image.jpg'
import { useEffect, useState, useRef } from 'react'

export default function Header() {
  const location = useLocation() //路由跳转时触发重渲染
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  const [menuOpen, setMenuOpen] = useState(false)
  const [prevLocation, setPrevLocation] = useState(location)
  const menuRef = useRef(null)

  if (prevLocation !== location) {
    setPrevLocation(location)
    setMenuOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, []) //点击菜单外面时关闭

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header>
      <div className="logo-group">
        <Link to="/" className="site-avatar">
          <img src={avatar} alt="我的博客" />
        </Link>
        <span>xhp</span>
      </div>
      <nav>
        <NavLink to='/' end>首页</NavLink>
        <NavLink to='/articles'>文章</NavLink>
        <NavLink to='/about'>关于我</NavLink>
        {username ? (
          <div className="user-menu" ref={menuRef}>
            <button className='user-avatar-btn' onClick={() => setMenuOpen(!menuOpen)}>
              <img src={userAvatar} alt={username} />
            </button>

            {menuOpen && (
              <div className="user-dropdown">
                <button className='user-dropdown-item' onClick={() => navigate('/profile')}>
                  个人中心
                </button>
                <button className='user-dropdown-item' onClick={handleLogout}>
                  退出登录
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to='/login'>登录</NavLink>
        )}
      </nav>
    </header>
  )
}
