import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Herstelt hash-anchor scroll na React Router navigatie.
 * React Router v6 scrollt niet automatisch naar #hash na route-change.
 * Plaatsing: sibling van <Routes> binnen BrowserRouter.
 */
export default function HashScrollHandler() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(id)
  }, [hash, pathname])

  return null
}
