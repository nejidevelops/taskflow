import { useState } from 'react';
import { signUp } from './authService'

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true)
    setMessage('')

    try {
      const data = await signUp(email, password);

      if (data.session) {
        setMessage('Account created successfully!');
      } else {
        setMessage('Please check your email to confirm your account.');
      }
    } catch (error) {
      setMessage(
        error instanceof Error
        ? error.message
        : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6"
      >
        <h1 className="text-2xl font-bold">
          Create your TaskFlow account 
        </h1>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-md p-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          className="w-full border rounded-md p-3"
        />

        <button
        type="submit" 
        disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        {message && <p role='status'>{message}</p>}
      </form>
    </main>
  )
}

export default RegisterPage;