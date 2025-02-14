'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await signIn('credentials', {
      ...formData,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid credentials')
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 text-black'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-lg w-96'
      >
        <h2 className='text-2xl font-semibold text-center mb-4'>Login</h2>
        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        <input
          type='text'
          placeholder='Username'
          value={formData.username}
          autoComplete='username'
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className='w-full p-2 border border-gray-300 rounded mt-2'
        />
        <input
          type='password'
          placeholder='Password'
          value={formData.password}
          autoComplete='current-password'
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className='w-full p-2 border border-gray-300 rounded mt-2'
        />
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded mt-4'
        >
          Login
        </button>
      </form>
    </div>
  )
}
