import { useState } from 'react'
import './App.css'
import { parseNietaShortLink, searchCharacter, generateImage } from './utils/api'
import CanvasEditor from './components/CanvasEditor'

function App() {
  const [input, setInput] = useState('')
  const [characterData, setCharacterData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState(localStorage.getItem('nieta_token') || '')
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [canvasImage, setCanvasImage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      let searchQuery = input
      
      // 检查是否为短链接
      if (input.startsWith('https://t.nieta.art/')) {
        const uuid = await parseNietaShortLink(input)
        if (uuid) {
          searchQuery = uuid
        }
      }
      
      // 搜索角色
      const searchResult = await searchCharacter(searchQuery)
      
      if (searchResult?.data?.list && searchResult.data.list.length > 0) {
        const firstResult = searchResult.data.list[0]
        setCharacterData({
          name: firstResult.name,
          avatar: firstResult.avatar || firstResult.header_image,
          description: firstResult.description || '无描述',
          image: firstResult.header_image || firstResult.avatar
        })
      } else {
        setError('未找到角色信息，请检查输入')
      }
      
      setLoading(false)
    } catch (err) {
      setError('获取角色信息失败，请检查输入或网络连接')
      setLoading(false)
    }
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value
    setToken(newToken)
    localStorage.setItem('nieta_token', newToken)
  }

  const handleGenerateImage = async () => {
    if (!token) {
      setError('请输入Neta Art TOKEN')
      return
    }
    
    if (!characterData) {
      setError('请先获取角色信息')
      return
    }
    
    setGenerating(true)
    setError('')
    
    try {
      const prompt = `创建一个有趣的表情包，角色: ${characterData.name}，顶部文字: ${topText}，底部文字: ${bottomText}`
      const result = await generateImage(token, prompt, characterData.image)
      
      if (result) {
        setGeneratedImage(result)
      } else {
        setError('生成图片失败，请检查TOKEN是否有效')
      }
      
      setGenerating(false)
    } catch (err) {
      setError('生成图片失败，请检查网络连接或TOKEN')
      setGenerating(false)
    }
  }

  const handleExportImage = () => {
    if (!canvasImage) {
      setError('请先创作表情包')
      return
    }
    
    const link = document.createElement('a')
    link.href = canvasImage
    link.download = `${characterData.name}_表情包.png`
    link.click()
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-surface shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">捏</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">捏Ta表情包生成器</h1>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="输入Neta Art TOKEN"
              value={token}
              onChange={handleTokenChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 输入区域 */}
        <section className="mb-8">
          <div className="bg-surface rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">输入角色信息</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="输入分享链接或角色名称"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  {loading ? '加载中...' : '获取封面'}
                </button>
              </div>
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
              )}
            </form>
          </div>
        </section>

        {/* 角色信息和编辑区域 */}
        {characterData && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 角色信息 */}
            <div className="bg-surface rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">角色信息</h2>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={characterData.avatar}
                  alt={characterData.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{characterData.name}</h3>
                  <p className="text-muted mt-1">{characterData.description}</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-gray-700">原始封面</h4>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={characterData.image}
                    alt="封面"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 表情包编辑 */}
            <div className="bg-surface rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">表情包创作</h2>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-6">
                <CanvasEditor
                  imageUrl={generatedImage || characterData.image}
                  topText={topText}
                  bottomText={bottomText}
                  onImageUpdate={setCanvasImage}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">顶部文字</label>
                  <input
                    type="text"
                    placeholder="输入顶部文字"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">底部文字</label>
                  <input
                    type="text"
                    placeholder="输入底部文字"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleGenerateImage}
                    disabled={generating}
                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-secondary to-primary text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    {generating ? '生成中...' : '生成二创图片'}
                  </button>
                  <button
                    onClick={handleExportImage}
                    disabled={!canvasImage}
                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    导出表情包
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-surface border-t border-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted text-sm">
          <p className="font-medium">捏Ta表情包生成器 © 2024</p>
          <p className="mt-2">基于 Neta Art API 开发</p>
        </div>
      </footer>
    </div>
  )
}

export default App
