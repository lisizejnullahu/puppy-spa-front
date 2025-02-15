'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await signIn('credentials', {
      ...formData,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid credentials')
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials ❌',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Success', description: 'Welcome back! ✅' })
      router.replace('/dashboard')
    }
  }

  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-background text-foreground'>
      <Card className='w-full max-w-sm border shadow-md'>
        <CardHeader>
          <CardTitle className='text-center text-lg'>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                type='text'
                placeholder='Enter your username'
                autoComplete='username'
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                autoComplete='current-password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={!formData.username || !formData.password}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
