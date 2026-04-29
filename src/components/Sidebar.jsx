import {
  ArrowUpCircle, LayoutDashboard, MessageCircle, Calendar,
  User, CreditCard, Send, RefreshCw, Globe, Star,
  TrendingUp, Grid3x3, Tablet, Settings, Search,
  ChevronRight, ChevronLeft, Zap, Award, Image,
} from 'lucide-react'

const NAV_SECTION_1 = [
  { icon: ArrowUpCircle, label: 'Launchpad' },
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: MessageCircle, label: 'Conversations' },
  { icon: Calendar, label: 'Calendars' },
  { icon: User, label: 'Contacts' },
  { icon: TrendingUp, label: 'Opportunities' },
  { icon: CreditCard, label: 'Payments' },
]

const NAV_SECTION_2 = [
  { icon: Send, label: 'Marketing', active: true },
  { icon: RefreshCw, label: 'Automation' },
  { icon: Globe, label: 'Sites' },
  { icon: Award, label: 'Memberships' },
  { icon: Image, label: 'Media storage' },
  { icon: Star, label: 'Reputation' },
  { icon: TrendingUp, label: 'Reporting' },
  { icon: Grid3x3, label: 'App marketplace' },
  { icon: Tablet, label: 'Mobile app' },
]

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`flex gap-2 items-center px-2 py-2 rounded-lg w-full cursor-pointer ${
        active ? 'bg-[#1D2939]' : 'hover:bg-[#1D2939]/50'
      }`}
    >
      <Icon
        size={20}
        strokeWidth={1.8}
        className={active ? 'text-white' : 'text-[#D0D5DD]'}
      />
      <span
        className={`text-[16px] font-medium leading-6 ${
          active ? 'text-white' : 'text-[#D0D5DD]'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default function Sidebar() {
  return (
    <>
      <div className="w-[280px] shrink-0" />
      <aside className="fixed top-0 left-0 flex flex-col w-[280px] h-screen bg-[#101828] px-2 py-4 shrink-0 overflow-y-auto z-20">
      <div className="flex flex-col flex-1 justify-between min-h-0">
        <div className="flex flex-col gap-4 flex-1 min-h-0">

          {/* Logo + Subaccount */}
          <div className="flex flex-col gap-2">
            {/* HighLevel logo mark */}
            <div className="h-10 flex items-center px-2">
              <HLLogo />
            </div>

            {/* Subaccount switcher */}
            <div className="flex items-center gap-2 bg-[#344054] rounded-lg px-2 py-2">
              <span className="flex-1 text-white/70 text-[14px] font-medium leading-none truncate">
                Headquarters 1800-PLUMBER-200..
              </span>
              <ChevronRight size={14} className="text-[#D0D5DD] shrink-0" />
            </div>
          </div>

          {/* Search + Quick action */}
          <div className="flex gap-2 items-center">
            <div className="flex flex-1 items-center justify-between border border-[#344054] rounded-lg pl-2 pr-1 py-1">
              <div className="flex gap-2 items-center">
                <Search size={15} className="text-[#98A2B3]" />
                <span className="text-[#98A2B3] text-[16px] leading-6">Search</span>
              </div>
              <kbd className="bg-[#344054] border border-[#344054] text-[#D0D5DD] text-[13px] px-1 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
            <div className="bg-[#344054] rounded-lg p-[11px] flex items-center justify-center cursor-pointer hover:bg-[#475467]">
              <Zap size={18} className="text-[#D0D5DD]" fill="#D0D5DD" />
            </div>
          </div>

          {/* Nav section 1 */}
          <div className="flex flex-col gap-1 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {NAV_SECTION_1.map(item => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>

            <div className="h-px bg-[#EAECF0] my-2" />

            <div className="flex flex-col gap-1">
              {NAV_SECTION_2.map(item => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Settings */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="h-px bg-[#EAECF0]" />
          <NavItem icon={Settings} label="Settings" />
        </div>
      </div>

    </aside>
      {/* Collapse toggle — fixed outside aside so overflow-y-auto doesn't clip it */}
      <div className="fixed bottom-6 left-[268px] z-30 bg-[#73E2A3] rounded-xl size-6 flex items-center justify-center shadow-sm cursor-pointer">
        <ChevronLeft size={14} className="text-[#101828]" strokeWidth={2.5} />
      </div>
    </>
  )
}

function HLLogo() {
  return (
    <svg width="40" height="32" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left arrow */}
      <path d="M8 36V20L18 8L28 20V36" stroke="#F9C400" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right arrow */}
      <path d="M22 36V20L32 8L42 20V36" stroke="#00C4C4" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
