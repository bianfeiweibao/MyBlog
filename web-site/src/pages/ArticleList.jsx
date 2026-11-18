import { useEffect, useState } from 'react'
import { getArticleList } from '../api/article'
import { Link, useSearchParams } from 'react-router-dom'
import { Pagination, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 3

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false) //是否正在请求文章列表接口
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [loaded, setLoaded] = useState(false) //是否加载total完毕

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setLoaded(false)
        const response = await getArticleList({ page, limit })
        setArticles(response.data.list)
        setTotal(response.data.total)
        setLoaded(true)
      } catch (err) {
        console.error(err)
        setError('获取文章列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, limit])

  useEffect(() => {
    // console.log(total)
    if (!loaded) return
    if (total === 0) {
      if (page !== 1) {
        setSearchParams({ page: '1', limit: String(limit) })
      }
      return
    }

    const safeLimit = Math.max(1, Math.min(limit, total))
    const maxPage = Math.max(1, Math.ceil(total / safeLimit))
    const safePage = page > maxPage ? 1 : page

    if (safePage === page && safeLimit === limit) return

    setSearchParams({
      page: String(safePage),
      limit: String(safeLimit)
    })
  }, [setSearchParams, page, limit, total, loaded])

  const handlePageChange = (newPage, newLimit) => {
    const targetPage = newLimit != limit ? 1 : newPage
    setSearchParams({ page: String(targetPage), limit: String(newLimit) })
  }

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="page">
      <h1>文章列表</h1>

      {articles.map((item) => (
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

      <div className="pagination">
        <ConfigProvider locale={zhCN}>
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger={false}
            showQuickJumper //快速跳页功能
            showTotal={(total) => `共 ${total} 条`}
            onChange={handlePageChange}
          />
        </ConfigProvider>
      </div>

    </div>
  )
}

