import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { DetailPage } from './pages/DetailPage'
import { EditDiscoveryPage } from './pages/EditDiscoveryPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { NewDiscoveryPage } from './pages/NewDiscoveryPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />} index />
        <Route element={<FavoritesPage />} path="/favorites" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<NewDiscoveryPage />} path="/new" />
        <Route element={<DetailPage />} path="/discovery/:id" />
        <Route element={<EditDiscoveryPage />} path="/discovery/:id/edit" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}

export default App
