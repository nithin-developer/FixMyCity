import ContentSection from '../components/content-section'
import { PasswordForm } from './password-form'
import { TwoFASetup } from '../2fa-auth/two-fa-setup'

export default function SettingsSecurity() {
  return (
    <div className="space-y-8">
      <ContentSection
        title='Password'
        desc='Manage your password settings.'
      >
        <PasswordForm />
      </ContentSection>

      <ContentSection
        title='Two-Factor Authentication'
        desc='Secure your account with an additional layer of protection.'
      >
        <TwoFASetup />
      </ContentSection>
   </div> 
  )
}
