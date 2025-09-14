import { ReactNode, useEffect } from 'react'
import { useAuth } from '@/stores/authStore'

type UserRole =  'admin' | 'collector' | 'municipal_officer'| string
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const auth = useAuth()

  // Check if authentication is required and user is not authenticated
  // Demo auto-login: if auth required and not authenticated, perform automatic demo login as admin
  useEffect(() => {
    if (requireAuth && !auth.isAuthenticated()) {
      // attempt demo login silently
      auth.login('admin@example.com', 'admin123')
    }
  }, [requireAuth, auth])
  if (requireAuth && !auth.isAuthenticated()) {
    // While logging in, just render nothing or a placeholder
    return <div className='p-4 text-sm text-muted-foreground'>Initializing demo session...</div>
  }

  // Check if specific roles are required
  if (requiredRoles.length > 0 && !auth.hasAnyRole(requiredRoles)) {
    toast.error('You do not have permission to access this page')
    return <Navigate to="/401" replace />
  }

  return <>{children}</>
}

// Higher-order component for role-based rendering
interface RoleBasedProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export function RoleBased({ children, allowedRoles, fallback = null }: RoleBasedProps) {
  const auth = useAuth()
  
  if (!auth.hasAnyRole(allowedRoles)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Hook for conditional rendering based on roles
export function useRoleAccess() {
  const auth = useAuth()
  
  const canAccess = (roles: UserRole[]) => auth.hasAnyRole(roles)
  const hasRole = (role: UserRole) => auth.hasRole(role)
  
  return {
    canAccess,
    hasRole,
    isSuperAdmin: hasRole('super_admin'),
    isAdmin: hasRole('collector'),
    isTrainer: hasRole('Municipal_Officer'),
    // example composite permissions (extend as needed)
    canManageEvents: canAccess(['super_admin']),
    canDeleteEvents: hasRole('super_admin'),
    canViewReports: canAccess(['super_admin', 'collector']),
  }
}
