import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticleById } from '../api/article'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await getArticleById(id)
        setArticle(response.data)
      } catch (err) {
        console.error(err)
        setError('获取文章失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div className="page">加载中...</div>
  }

  if (error) {
    return (
      <div className="page">
        <p>{error}</p>
        <Link to="/articles">返回文章列表</Link>
      </div>
    )
  }

  return (
    <article className="page article-detail">
      <h1>{article.title}</h1>
      <p className="meta">
        作者：{article.author || 'xhp'} · {article.createdAt.replace('T', ' ').substring(0, 19)}
      </p>
      <div className="content">{article.content}</div>
      <Link to="/articles">返回文章列表</Link>
    </article>
  )
}
