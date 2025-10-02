import { useLenis } from './hooks/useLenis';
import AppRoutes from './routes/AppRoutes';

function App() {
  // Initialize Lenis smooth scrolling
  useLenis();

  return <AppRoutes />;
}

export default App;
