'use client'

import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState('5')
  const [style, setStyle] = useState('realistic')
  const [uploadTo, setUploadTo] = useState<string[]>(['youtube', 'tiktok'])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [uploadResults, setUploadResults] = useState<any>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('لطفا توضیحات ویدیو را وارد کنید')
      return
    }

    setLoading(true)
    setStatus('در حال تولید ویدیو...')
    setVideoUrl('')
    setUploadResults(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration: parseInt(duration),
          style,
          uploadTo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'خطا در تولید ویدیو')
      }

      setVideoUrl(data.videoUrl)
      setUploadResults(data.uploadResults)
      setStatus('ویدیو با موفقیت تولید و آپلود شد!')
    } catch (error: any) {
      setStatus(`خطا: ${error.message}`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const togglePlatform = (platform: string) => {
    setUploadTo(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            🎬 ایجنت تولید ویدیو
          </h1>
          <p className="text-white/80 text-center mb-8">
            ویدیو بسازید و مستقیم به تیک‌تاک و یوتیوب آپلود کنید
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                توضیحات ویدیو
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: یک گربه در حال بازی با توپ در یک باغ سرسبز"
                className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  مدت زمان (ثانیه)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                >
                  <option value="3">3 ثانیه</option>
                  <option value="5">5 ثانیه</option>
                  <option value="10">10 ثانیه</option>
                  <option value="15">15 ثانیه</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  استایل
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                >
                  <option value="realistic">واقع‌گرایانه</option>
                  <option value="anime">انیمه</option>
                  <option value="cartoon">کارتونی</option>
                  <option value="cinematic">سینمایی</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                آپلود به:
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => togglePlatform('youtube')}
                  className={`flex-1 p-4 rounded-lg font-semibold transition-all ${
                    uploadTo.includes('youtube')
                      ? 'bg-red-600 text-white'
                      : 'bg-white/20 text-white/60'
                  }`}
                  disabled={loading}
                >
                  📺 YouTube
                </button>
                <button
                  onClick={() => togglePlatform('tiktok')}
                  className={`flex-1 p-4 rounded-lg font-semibold transition-all ${
                    uploadTo.includes('tiktok')
                      ? 'bg-black text-white'
                      : 'bg-white/20 text-white/60'
                  }`}
                  disabled={loading}
                >
                  🎵 TikTok
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || uploadTo.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '⏳ در حال پردازش...' : '🚀 تولید و آپلود ویدیو'}
            </button>

            {status && (
              <div className={`p-4 rounded-lg ${
                status.includes('خطا')
                  ? 'bg-red-500/20 text-red-200'
                  : 'bg-green-500/20 text-green-200'
              }`}>
                {status}
              </div>
            )}

            {videoUrl && (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">ویدیو تولید شده:</h3>
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            )}

            {uploadResults && (
              <div className="bg-white/10 p-4 rounded-lg space-y-3">
                <h3 className="text-white font-semibold">نتایج آپلود:</h3>
                {uploadResults.youtube && (
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-2xl">📺</span>
                    <span>YouTube: {uploadResults.youtube.success ? '✅ موفق' : '❌ ناموفق'}</span>
                    {uploadResults.youtube.url && (
                      <a
                        href={uploadResults.youtube.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:underline"
                      >
                        مشاهده
                      </a>
                    )}
                  </div>
                )}
                {uploadResults.tiktok && (
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-2xl">🎵</span>
                    <span>TikTok: {uploadResults.tiktok.success ? '✅ موفق' : '❌ ناموفق'}</span>
                    {uploadResults.tiktok.url && (
                      <a
                        href={uploadResults.tiktok.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:underline"
                      >
                        مشاهده
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-200 text-sm">
              ⚠️ برای استفاده واقعی، باید API Key های YouTube و TikTok را در متغیرهای محیطی تنظیم کنید:
              <code className="block mt-2 bg-black/30 p-2 rounded">
                YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN<br/>
                TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_ACCESS_TOKEN
              </code>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
