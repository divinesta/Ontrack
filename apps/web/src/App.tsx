import { usePathname } from './hooks/usePathname'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

const App = () => {
  const pathname = usePathname()

  if (pathname === '/login') return <Login />
  if (pathname === '/signup') return <Signup />

  return <Landing />
}

export default App