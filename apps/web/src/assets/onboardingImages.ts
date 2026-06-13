/** Same Unsplash sources as apps/mobile/src/features/onboarding/variants/OnboardingImages.tsx */

const imageParams = 'auto=format&fit=crop&w=1400&q=85'

export const welcomeImages = [
  `https://images.unsplash.com/photo-1499750310107-5fef28a66643?${imageParams}`,
  `https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?${imageParams}`,
  `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?${imageParams}`,
] as const

export const signupImages = [
  `https://images.unsplash.com/photo-1506784983877-45594efa4cbe?${imageParams}`,
  `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?${imageParams}`,
  `https://images.unsplash.com/photo-1512314889357-e157c22f938d?${imageParams}`,
] as const

export const loginHeroImage = welcomeImages[0]
export const signupHeroImage = signupImages[0]