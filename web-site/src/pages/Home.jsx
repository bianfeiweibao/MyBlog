import { Link } from 'react-router-dom'
import Img from '../assets/img.jpg'
import { getArticleList } from '../api/article'
import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    getArticleList({ page: 1, limit: 3 })
      .then((res) => setPosts(res.data.list))
      .catch((err) => console.error(err))
  }, [])

  return (
    <section className="page">
      <h1>欢迎来到我的博客</h1>
      <p>这里会记录我的学习笔记、项目实践和生活思考。</p>

      <div className="hero">
        <img className="hero-img" src={Img} alt="博客题图" />
      </div>
      <div className="section-label">文 · Recent Writings</div>
      {posts.map((item) => (
        <div className="post-item" key={item.id}>
          <div className="post-date">
            {new Date(item.createdAt).toLocaleDateString('zh-CN').replaceAll('/', '.')}
          </div>
          <h2>
            <Link to={`/articles/${item.id}`}>{item.title}</Link>
          </h2>
          <p className="post-excerpt">{item.content.slice(0, 80)}...</p>
          <Link className="read-more" to={`/articles/${item.id}`}>继续阅读</Link>
        </div>
      ))}

      <div className="actions">
        <Link to="/articles">开始阅读</Link>
        <Link to="/about">了解我</Link>
      </div>
    </section>
  )
}
