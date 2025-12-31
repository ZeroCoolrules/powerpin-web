import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CubeTransparentIcon,
  SparklesIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const navItems = [
  { name: 'Endless', icon: CubeTransparentIcon, href: '/endless' },
  { name: 'Ghost Pool', icon: SparklesIcon, href: '/ghost-pool' },
  { name: 'GPT Store', icon: CpuChipIcon, href: '/gpt-store' },
  { name: 'Endless / TIME', icon: ArrowPathIcon, href: '/tokens' },
  { name: 'Proof of Intent', icon: ChartBarIcon, href: '/proof-dashboard' },
]

export default function SideRail() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      /* 🔑 CRITICAL: prevent first-render mismatch */
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25 }}
      className="
        fixed left-0 top-0 z-50 h-screen
        bg-black/70 backdrop-blur-xl
        border-r border-green-500/20
      "
    >
      {/* Toggle */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setCollapsed(v => !v)}
          className="text-green-400 hover:text-green-300"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-6 space-y-2 px-2">
        {navItems.map(item => (
          <Link key={item.name} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="
                flex items-center gap-3 rounded-lg px-3 py-3
                text-green-300 hover:bg-green-500/10
              "
            >
              <item.icon className="h-6 w-6 text-green-400 shrink-0" />

              {/* 🔑 AnimatePresence must NOT run on first render */}
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}
      </nav>
    </motion.aside>
  )
}
