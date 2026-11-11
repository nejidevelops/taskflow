import { useState } from 'react';
import { signIn } from './authService'

function LoginPage() {
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
      const data = await signIn(email, password);
      setLoading(false)
      if (data.session) {
        setMessage('Logged in successfully!');
      } else {
        setMessage('Please check your email to confirm your account.');
      }
    } catch (error) {
      setLoading(false)
      setMessage('An error occurred while logging in.');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6"
      >
        <h1 className="text-2xl font-bold">
          Log in to your TaskFlow account 
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
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {message && (
          <p className="text-red-500 text-sm mt-2">{message}</p>
        )}
      </form>
    </main>
  );
}

export default LoginPage;