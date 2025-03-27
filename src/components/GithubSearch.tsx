import { useState, KeyboardEvent } from 'react'
import axios from 'axios'
import githubLogo from '../assets/github.svg'

interface GithubUser {
  login: string
  avatar_url: string
  bio: string
  name: string
}

export default function GithubSearch() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<GithubUser | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const searchUser = async () => {
    if (!username.trim()) return
    
    setLoading(true)
    setError('')
    setUser(null)

    try {
      const response = await axios.get(`https://api.github.com/users/${username}`)
      setUser(response.data)
    } catch (err) {
      setError('Nenhum perfil foi encontrado com ese nome de usuário.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchUser()
    }
  }

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg p-8 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <img src={githubLogo} alt="GitHub Logo" className="w-48 h-48" />
        <h1 className="text-3xl font-bold text-white">Perfil GitHub</h1>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite um usuário do Github"
          className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={searchUser}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-100 p-4 rounded-lg text-center">
          {error}
          <div className="mt-2">
            <button
              onClick={() => setError('')}
              className="text-sm underline hover:text-white"
            >
              Tente novamente
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="bg-white/20 rounded-lg p-6 text-white space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{user.name || user.login}</h2>
              <p className="text-white/80">@{user.login}</p>
            </div>
          </div>
          {user.bio && (
            <p className="text-white/90">{user.bio}</p>
          )}
        </div>
      )}
    </div>
  )
} 