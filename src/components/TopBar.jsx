import { Sparkles, Megaphone, Bell, HelpCircle, Plus, Settings, RefreshCw } from 'lucide-react'

/* Row 1: section tabs under "Marketing" */
const SECTION_TABS = ['Social planner', 'Emails', 'Snippets', 'Countdown timer', 'Brand boards', 'Ad manager']
const ACTIVE_SECTION_TAB = 'Social planner'

/* Row 2: sub-tabs under "Social planner" */
const SUB_TABS = ['Planner', 'Content', 'Comments', 'Statistics', 'Social listening', 'Settings']
const ACTIVE_SUB_TAB = 'Social listening'

export default function TopBar() {
  return (
    <header className="bg-white w-full flex flex-col shrink-0">

      {/* ── Row 1: Marketing title + section tabs + global actions ── */}
      <div className="flex items-center gap-12 px-4 py-1 border-b border-[#EAECF0] shadow-[0px_1px_1px_rgba(16,24,40,0.05)]">

        {/* Left: Title + tabs */}
        <div className="flex flex-1 items-end gap-3 min-w-0">
          <span className="text-[20px] font-semibold text-[#101828] leading-[30px] whitespace-nowrap shrink-0">
            Marketing
          </span>
          <div className="flex items-center gap-1 overflow-x-auto pb-0">
            {SECTION_TABS.map(tab => (
              <div key={tab} className="relative flex items-center justify-center px-2 h-6 shrink-0">
                <span
                  className={`text-[16px] whitespace-nowrap ${
                    tab === ACTIVE_SECTION_TAB
                      ? 'font-semibold text-[#155EEF]'
                      : 'font-medium text-[#667085]'
                  }`}
                >
                  {tab}
                </span>
                {tab === ACTIVE_SECTION_TAB && (
                  <span className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-[#155EEF] rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: global action icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI */}
          <div className="size-8 rounded-full bg-[#6938EF] flex items-center justify-center cursor-pointer">
            <Sparkles size={14} className="text-white" />
          </div>
          {/* Announcements with red dot */}
          <div className="relative size-8 cursor-pointer">
            <div className="size-8 rounded-full bg-[#209681] flex items-center justify-center">
              <Megaphone size={14} className="text-white" />
            </div>
            <span className="absolute top-0 right-0 size-2 rounded-full bg-red-500 border border-white" />
          </div>
          {/* Notifications */}
          <div className="size-8 rounded-full bg-[#FF681E] flex items-center justify-center cursor-pointer">
            <Bell size={14} className="text-white" />
          </div>
          {/* Help */}
          <div className="size-8 rounded-full bg-[#008AEF] flex items-center justify-center cursor-pointer">
            <HelpCircle size={14} className="text-white" />
          </div>
          {/* User avatar */}
          <div className="size-8 rounded-full bg-[#65B5BC] flex items-center justify-center cursor-pointer">
            <span className="text-white text-[14px] font-medium leading-none">SS</span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Social planner subtitle + sub-tabs + action buttons ── */}
      <div className="flex items-center gap-12 px-4 border-b border-[#D0D5DD]">

        {/* Left: subtitle + sub-tabs */}
        <div className="flex flex-1 items-end gap-2 min-w-0 pt-1">
          <span className="text-[16px] font-semibold text-[#101828] leading-6 whitespace-nowrap shrink-0 pb-1">
            Social planner
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {SUB_TABS.map(tab => (
              <div key={tab} className="relative flex items-center justify-center px-2 h-[28px] shrink-0">
                <span className={`flex items-center gap-1.5 text-[15px] whitespace-nowrap ${
                    tab === ACTIVE_SUB_TAB
                      ? 'font-semibold text-[#004EEB]'
                      : 'font-medium text-[#667085]'
                  }`}
                >
                  {tab}
                  {tab === 'Social listening' && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#155EEF] leading-none">Beta</span>
                  )}
                </span>
                {tab === ACTIVE_SUB_TAB && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#155EEF] rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 shrink-0 py-1.5">
          {/* Icon-only buttons */}
          <button className="size-8 flex items-center justify-center rounded hover:bg-[#F2F4F7]">
            <RefreshCw size={15} className="text-[#344054]" />
          </button>
          <button className="size-8 flex items-center justify-center rounded hover:bg-[#F2F4F7]">
            <Settings size={15} className="text-[#344054]" />
          </button>
          {/* + Socials */}
          <button className="flex items-center gap-2 h-8 px-2.5 py-1.5 rounded border border-[#D0D5DD] bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] text-[#344054] text-[14px] font-semibold hover:bg-[#F9FAFB]">
            <Plus size={15} />
            Socials
          </button>
          {/* + New post */}
          <button className="flex items-center gap-2 h-8 px-2.5 py-1.5 rounded border border-[#155EEF] bg-[#155EEF] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] text-white text-[14px] font-semibold hover:bg-[#1249C0]">
            <Plus size={15} />
            New post
          </button>
        </div>
      </div>
    </header>
  )
}
