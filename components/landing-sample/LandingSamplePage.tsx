import { CtaBanner } from './CtaBanner'
import { FeatureScroll } from './FeatureScroll'
import { FieldReadyStory } from './FieldReadyStory'
import { HeroSample } from './HeroSample'
import { MissionControl } from './MissionControl'
import { ProductScroll } from './ProductScroll'
import { SignatureAndPartners } from './SignatureAndPartners'

export function LandingSamplePage() {
  return (
    <div className="bg-[#0f172a] text-slate-100">
      <HeroSample />
      <FeatureScroll />
      <MissionControl />
      <FieldReadyStory />
      <ProductScroll />
      <SignatureAndPartners />
      <CtaBanner />
    </div>
  )
}
