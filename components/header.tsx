"use client"

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      <div className="flex items-center">
        <div className="text-white text-2xl font-bold tracking-wider">ZH</div>
      </div>

      <nav className="flex items-center space-x-2">
        <span className="text-white/60 text-xs font-light">+33 6 19 34 29 62</span>
      </nav>

      <div className="relative flex items-center group">
        <a
          href="mailto:trighap52@gmail.com"
          className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center"
        >
          Contact
        </a>
      </div>
    </header>
  )
}
