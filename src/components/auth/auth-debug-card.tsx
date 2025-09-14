import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/stores/authStore'
import { cleanupConflictingAuthData, getAuthSummary, hasConflictingAuthData } from '@/utils/auth-cleanup'
import { toast } from 'sonner'

export function AuthDebugCard() {
  const [authSummary, setAuthSummary] = useState(getAuthSummary())
  const [hasConflicts, setHasConflicts] = useState(hasConflictingAuthData())
  const auth = useAuth()

  const refreshData = () => {
    setAuthSummary(getAuthSummary())
    setHasConflicts(hasConflictingAuthData())
  }

  const handleCleanup = () => {
    cleanupConflictingAuthData()
    refreshData()
    toast.success('Auth data cleaned up successfully')
  }

  // In demo mode we don't have a separate load method; simulate refresh
  const handleReloadAuth = () => {
    refreshData()
    toast.success('Auth data refreshed (demo)')
  }

  const handleLogout = () => {
    auth.reset()
    refreshData()
    toast.success('Logged out and data cleared')
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Auth Debug Panel
          <div className="flex gap-2">
            {hasConflicts && (
              <Badge variant="destructive">Conflicts Detected</Badge>
            )}
            <Badge variant={auth.isAuthenticated() ? 'default' : 'secondary'}>
              {auth.isAuthenticated() ? 'Authenticated' : 'Not Authenticated'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={refreshData} variant="outline">
            Refresh Data
          </Button>
          <Button onClick={handleReloadAuth} variant="outline">
            Reload Auth
          </Button>
          <Button 
            onClick={handleCleanup} 
            variant={hasConflicts ? 'destructive' : 'outline'}
          >
            Clean Up Conflicts
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Force Logout
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Current Auth State:</h4>
          <div className="bg-muted p-3 rounded text-sm">
            <div>User: {auth.user?.email || 'None'}</div>
            <div>Role: {auth.user?.role || 'None'}</div>
            <div>Token: {auth.accessToken ? `${auth.accessToken.substring(0, 20)}...` : 'None'}</div>
            <div>Authenticated: {auth.isAuthenticated() ? 'Yes' : 'No'}</div>
            {/* Demo: no exp on user object; access token expiry handled separately */}
            {auth.expiresAt && (
              <div>
                Access Expires: {new Date(auth.expiresAt).toLocaleString()}
                {Date.now() > auth.expiresAt && <span className="text-destructive"> (EXPIRED)</span>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Storage Summary:</h4>
          <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(authSummary, null, 2)}
          </pre>
        </div>

        {hasConflicts && (
          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Conflicting auth data detected! This may cause login issues.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Clean Up Conflicts" to resolve this issue.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
