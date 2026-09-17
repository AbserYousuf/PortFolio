import { useState, useRef, useEffect } from 'react'

// --- Icons ---
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
)

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5A1.97 1.97 0 1 0 5.27 7.44 1.97 1.97 0 0 0 5.25 3.5ZM20.5 20.5H17.13V14.6C17.13 13.2 17.1 11.4 15.15 11.4C13.17 11.4 12.87 12.92 12.87 14.5V20.5H9.5V8.5H12.73V10H12.78C13.23 9.15 14.33 8.25 15.98 8.25C19.4 8.25 20.5 10.47 20.5 13.37V20.5Z" />
  </svg>
)

const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M3 6.5h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11Z" />
    <path d="m3 6.5 9 7 9-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronUpIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// --- Hooks ---
function useMouseParallax(strength = 12) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * strength
      const y = (e.clientY / window.innerHeight - 0.5) * strength
      setPosition({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength])
  return position
}

function useReveal(options = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = options
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, visible]
}

// --- Components ---
function MotionText({ children, className = '', as: Tag = 'p' }) {
  const [ref, visible] = useReveal({ threshold: 0.15, rootMargin: '0px' })
  return (
    <Tag ref={ref} className={`text-drift ${visible ? 'in-view' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
  const [ref, visible] = useReveal()
  const hiddenClass =
    variant === 'left' ? 'reveal-left-hidden' : variant === 'scale' ? 'reveal-scale-hidden' : 'reveal-hidden'

  return (
    <div
      ref={ref}
      className={`reveal-base ${visible ? 'reveal-visible' : hiddenClass} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

function SectionHeading({ children }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className="mb-6 sm:mb-8 inline-block">
      <h2 className="font-display text-[clamp(1.4rem,4vw,2rem)] tracking-tight text-ink">{children}</h2>
      <span
        className={`mt-2.5 block h-[2px] origin-left bg-accent transition-all duration-700 ease-out ${
          visible ? 'w-12 sm:w-14 scale-x-100' : 'w-0 scale-x-0'
        }`}
      />
    </div>
  )
}

function NextSectionArrow({ targetRef, label }) {
  return (
    <button
      onClick={() => targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      aria-label={label || 'Scroll to next section'}
      className="group absolute bottom-6 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-white/10 hover:text-accent sm:bottom-8 sm:h-11 sm:w-11"
    >
      <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
    </button>
  )
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-transparent sm:h-[2.5px]">
      <div
        className="h-full bg-accent transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, boxShadow: '0 0 12px rgba(201,161,90,0.45)' }}
      />
    </div>
  )
}

function GoldParticles() {
  const particles = useRef(
    [...Array(10)].map(() => ({
      size: Math.random() * 2.5 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 7 + Math.random() * 9,
      delay: Math.random() * 5,
      opacity: 0.25 + Math.random() * 0.35,
    }))
  ).current

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-accent/40"
          style={{
            width: p.size + 'px',
            height: p.size + 'px',
            left: p.left + '%',
            top: p.top + '%',
            animation: `floatParticle ${p.duration}s ease-in-out infinite`,
            animationDelay: p.delay + 's',
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY })
    const addHover = () => setIsHovering(true)
    const removeHover = () => setIsHovering(false)

    window.addEventListener('mousemove', move)
    const targets = document.querySelectorAll('a, button')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden mix-blend-difference md:block"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div
        className={`rounded-full bg-white transition-all duration-200 ${
          isHovering ? 'h-8 w-8 -translate-x-4 -translate-y-4' : 'h-3 w-3 -translate-x-1.5 -translate-y-1.5'
        }`}
      />
    </div>
  )
}

function PageLoader() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setLoading(false), 600)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#0B0C0E] transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
        <div className="text-center">
          <p className="font-display text-sm tracking-[0.25em] text-white/80">ABSER YOUSUF</p>
          <p className="mt-1.5 text-xs tracking-widest text-white/40">Portfolio</p>
        </div>
      </div>
    </div>
  )
}

function FloatKeyframes() {
  return (
    <style>{`
      @keyframes floatUpDown {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-16px); }
      }
    `}</style>
  )
}

// --- Data ---
const floatingIcons = [
  { src: '/cpp.png', alt: 'C++', height: 48, duration: 3.4, delay: 0 },
  { src: '/javascript.png', alt: 'JavaScript', height: 48, duration: 3.9, delay: 0.4 },
  { src: '/html5.png', alt: 'HTML5', height: 50, duration: 3.1, delay: 0.9 },
  { src: '/python.png', alt: 'Python', height: 46, duration: 4.2, delay: 0.2 },
  { src: '/react.png', alt: 'React', height: 48, duration: 3.6, delay: 1.1 },
  { src: '/tool.png', alt: 'Build tooling', height: 40, duration: 3.3, delay: 0.6 },
  { src: '/mongodb.png', alt: 'MongoDB', height: 28, duration: 4.0, delay: 1.4 },
  { src: '/express.png', alt: 'Express', height: 20, duration: 3.7, delay: 0.3 },
  { src: '/node.png', alt: 'Node.js', height: 34, duration: 3.5, delay: 0.8 },
]

const projects = [
  {
    id: 'textutils',
    name: 'TextUtils',
    icon: '/TextUtilis.png',
    tech: ['React', 'JavaScript'],
    description:
      'A text utility web app for everyday text cleanup — convert between upper/lower case, trim extra spaces, count words and characters, and preview the result instantly as you type.',
    link: 'https://text-utilis-app.netlify.app/',
    video: '/videos/TextUtilis.mp4',
  },
  {
    id: 'serabo',
    name: 'ChatBot Serabo',
    icon: '/Serabo.png',
    tech: ['React', 'Node.js', 'API integration'],
    description:
      'A conversational AI chatbot built to handle text-based Q&A and everyday conversation. It currently works with text only — image and file support are on the roadmap.',
    link: 'https://sereboaai-two.vercel.app/',
    video: '/videos/SeraboAi.mp4',
  },
  {
    id: 'newsmonkey',
    name: 'NewsMonkey',
    icon: '/NewsGorilla.png',
    tech: ['React', 'REST API'],
    description:
      'A news reader app that pulls live headlines and articles by category, with pagination so you can keep browsing without the page slowing down.',
    link: 'https://newsgorila.netlify.app/',
    video: '/videos/NewsMonkey.mp4',
  },
  {
    id: 'inotebook',
    name: 'iNotebook',
    icon: '/inotebook.png',
    tech: ['MERN Stack', 'JWT Auth'],
    description:
      'A full-stack note-taking app with user authentication — each user logs in securely and manages their own private notes, with full CRUD backed by Node.js and MongoDB.',
    link: 'https://inotebook-seeker.netlify.app/',
    video: '/videos/INotebook.mp4',
  },
  {
    id: 'owlping',
    name: 'OwlPing',
    icon: '/Ealhs.jpg',
    tech: ['React Native', 'Socket.io', 'Node.js'],
    description:
      'A real-time messaging Android app built to understand modern chat architecture — instant delivery, live connection handling, OTP verification, and clean session management.',
    link: 'https://github.com/AbserYousuf/OwlPing/releases/download/v1.0/OwlPing.apk',
    video: '/videos/OwlPing.mp4',
  },
]

function FloatingTechRow({ items }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 px-2 py-6 sm:gap-x-12 sm:gap-y-10 sm:px-4 sm:py-8">
      {items.map((item) => (
        <img
          key={item.alt}
          src={item.src}
          alt={item.alt}
          title={item.alt}
          style={{
            height: item.height,
            animationName: 'floatUpDown',
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
          className="tech-icon w-auto select-none"
          draggable={false}
        />
      ))}
    </div>
  )
}

function LanguageList({ items }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
      {items.map((item) => (
        <span key={item.alt} className="text-[12px] sm:text-[13px] tracking-wide text-muted/80 transition-colors hover:text-accent">
          {item.alt}
        </span>
      ))}
    </div>
  )
}

function ProjectSection({ project, index }) {
  const videoRef = useRef(null)
  const sectionRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section || !shouldLoad) return

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.35 }
    )

    playObserver.observe(section)
    return () => playObserver.disconnect()
  }, [shouldLoad])

  return (
    <section
      ref={sectionRef}
      data-project-section
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={project.video} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-5 py-20 sm:px-8 sm:py-24 md:px-12 lg:px-16">
        <Reveal delay={80}>
          <div className="max-w-2xl">
            <p className="mb-2 text-xs tracking-widest text-accent/80 sm:mb-3 sm:text-sm">
              0{index + 1} / PROJECT
            </p>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-bold tracking-tight text-white leading-tight">
              {project.name}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 sm:px-3 sm:text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              {project.description}
            </p>
            <a
              href={project.link}
              target={project.id === 'owlping' ? undefined : '_blank'}
              rel="noreferrer"
              className="btn-motion mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-8 sm:mt-8"
            >
              {project.id === 'owlping' ? 'Download App' : 'View Project'} →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function AvatarSelector({ items }) {
  const [activeId, setActiveId] = useState(items[0].id)
  const [fadeKey, setFadeKey] = useState(0)
  const active = items.find((p) => p.id === activeId)

  const handleSelect = (id) => {
    if (id === activeId) return
    setActiveId(id)
    setFadeKey((k) => k + 1)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
        {items.map((p) => {
          const isActive = p.id === activeId
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="group flex flex-col items-center gap-2 focus:outline-none sm:gap-3"
            >
              <div
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 sm:rounded-2xl ${
                  isActive
                    ? 'h-16 w-16 border-accent shadow-[0_0_0_4px_rgba(201,161,90,0.15)] sm:h-20 sm:w-20 md:h-24 md:w-24'
                    : 'h-14 w-14 border-white/20 group-hover:border-accent/50 sm:h-16 sm:w-16 md:h-20 md:w-20'
                }`}
              >
                <img src={p.icon} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <span className={`text-[11px] sm:text-xs transition-colors ${isActive ? 'text-white' : 'text-white/50'}`}>
                {p.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-col items-start gap-4 rounded-xl border border-white/10 bg-black/30 p-4 sm:mt-8 sm:flex-row sm:gap-6 sm:rounded-2xl sm:p-6">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-24 sm:w-24 sm:rounded-2xl">
          <img src={active.icon} alt={active.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-display text-lg text-white sm:text-xl md:text-2xl">{active.name}</h4>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/70 sm:mt-3 sm:text-sm">
            {active.description}
          </p>
          <a
            href={active.link}
            target={active.id === 'owlping' ? undefined : '_blank'}
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs text-accent hover:underline sm:mt-4 sm:text-sm"
          >
            {active.id === 'owlping' ? 'Download' : 'View Project'} →
          </a>
        </div>
      </div>
    </div>
  )
}

// --- Main App ---
export default function App() {
  const heroRef = useRef(null)
  const languagesRef = useRef(null)
  const projectsRef = useRef(null)
  const avatarsRef = useRef(null)
  const thanksRef = useRef(null)
  const parallax = useMouseParallax(12)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const playWelcomeSound = () => {
    try {
      const audio = new Audio('/sounds/welcome.mp3')
      audio.volume = 0.25
      audio.play().catch(() => {})
    } catch (e) {}
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3
      const projectSections = document.querySelectorAll('[data-project-section]')
      let isInProjects = false

      projectSections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.6 && rect.bottom > 100) {
          isInProjects = true
        }
      })

      if (isInProjects) {
        setActiveSection('projects')
        return
      }

      const sections = [
        { id: 'home', ref: heroRef },
        { id: 'about', ref: projectsRef },
        { id: 'contact', ref: thanksRef },
      ]

      for (const section of sections) {
        if (section.ref.current) {
          const top = section.ref.current.offsetTop
          const height = section.ref.current.offsetHeight
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileMenuOpen(false)
  }

  return (
    <div className="bg-bg font-body text-ink antialiased">
      <PageLoader />
      <ScrollProgress />
      <FloatKeyframes />
      <CustomCursor />

      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 md:px-12 lg:px-16">
        <span className="font-display text-base tracking-tight text-white sm:text-lg">Abser Yousuf</span>

        <div className="hidden items-center gap-7 text-sm sm:flex">
          <button onClick={() => scrollTo(heroRef)} className={`transition-colors ${activeSection === 'home' ? 'text-accent' : 'text-white/70 hover:text-white'}`}>Home</button>
          <button onClick={() => scrollTo(projectsRef)} className={`transition-colors ${activeSection === 'about' ? 'text-accent' : 'text-white/70 hover:text-white'}`}>About</button>
          <button onClick={() => scrollTo(projectsRef)} className={`transition-colors ${activeSection === 'projects' ? 'text-accent' : 'text-white/70 hover:text-white'}`}>Projects</button>
          <button onClick={() => scrollTo(thanksRef)} className={`transition-colors ${activeSection === 'contact' ? 'text-accent' : 'text-white/70 hover:text-white'}`}>Contacts</button>
        </div>

        <button className="flex h-9 w-9 items-center justify-center text-white sm:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </div>
        </button>

        <div className="hidden items-center gap-4 sm:flex">
          <a href="https://github.com/AbserYousuf" target="_blank" rel="noreferrer" className="text-white/70 transition-colors hover:text-white"><GithubIcon className="h-5 w-5" /></a>
          <a href="https://www.linkedin.com/in/abser-yousuf-69a56137b" target="_blank" rel="noreferrer" className="text-white/70 transition-colors hover:text-white"><LinkedinIcon className="h-5 w-5" /></a>
          <a href="mailto:abseryousuf50@gmail.com" className="text-white/70 transition-colors hover:text-white"><MailIcon className="h-5 w-5" /></a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-md transition-all duration-300 sm:hidden ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="flex h-full flex-col items-center justify-center gap-7">
          <button onClick={() => scrollTo(heroRef)} className="font-display text-xl text-white">Home</button>
          <button onClick={() => scrollTo(projectsRef)} className="font-display text-xl text-white">About</button>
          <button onClick={() => scrollTo(projectsRef)} className="font-display text-xl text-white">Projects</button>
          <button onClick={() => scrollTo(thanksRef)} className="font-display text-xl text-white">Contacts</button>
          <div className="mt-8 flex items-center gap-6">
            <a href="https://github.com/AbserYousuf" target="_blank" rel="noreferrer"><GithubIcon className="h-5 w-5 text-white/70" /></a>
            <a href="https://www.linkedin.com/in/abser-yousuf-69a56137b" target="_blank" rel="noreferrer"><LinkedinIcon className="h-5 w-5 text-white/70" /></a>
            <a href="mailto:abseryousuf50@gmail.com"><MailIcon className="h-5 w-5 text-white/70" /></a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100dvh] overflow-hidden">
        <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65" />
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 30%, rgba(0,0,0,0.25), transparent), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(0,0,0,0.2), transparent)`
        }} />
        <GoldParticles />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col items-center px-5 pt-20 pb-20 sm:px-8 sm:pt-24 sm:pb-24 md:flex-row md:items-center md:px-12 lg:px-16">
          <div className="flex w-full flex-col justify-center md:w-[48%] hero-text-animate">
            <p className="text-sm text-white/60 sm:text-base">Hi, I'm Abser,</p>
            <h1 className="mt-2 font-display text-[clamp(2.1rem,7vw,4.5rem)] font-bold leading-[1.08] tracking-tight text-white sm:mt-3">
              I'M A FULL STACK<br />DEVELOPER
            </h1>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/55 sm:mt-6 sm:text-[15px]">
              I build scalable web applications and cross-platform mobile apps using the MERN stack and React Native. Focused on clean code, performance, and great user experience.
            </p>
            <button onClick={() => scrollTo(projectsRef)} className="btn-motion mt-6 w-fit text-sm font-medium text-white underline underline-offset-8 sm:mt-8 sm:text-[15px]">
              View My Projects
            </button>
          </div>

          <div className="mt-10 flex w-full justify-center md:mt-0 md:w-[52%] md:justify-end hero-avatar-animate">
            <div
              className="group relative h-[340px] w-full max-w-[280px] sm:h-[420px] sm:max-w-[340px] md:h-[65vh] md:max-w-[400px] lg:h-[75vh] lg:max-w-[460px]"
              onMouseEnter={playWelcomeSound}
            >
              <img
                src="/avatar-crossed.png"
                alt="Abser Yousuf"
                className="absolute inset-0 h-full w-full object-contain object-bottom transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95"
                style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
              />
              <img
                src="/avatar-open.png"
                alt="Abser Yousuf welcoming"
                className="absolute inset-0 h-full w-full object-contain object-bottom opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
              />
              <div className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-700 delay-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="relative">
                  <div className="absolute inset-0 scale-150 bg-[#9B2C2C]/40 blur-xl" />
                  <span className="relative font-display text-lg font-semibold tracking-[0.12em] text-[#C45C5C] drop-shadow-[0_2px_12px_rgba(155,44,44,0.6)] sm:text-xl">
                    Welcome
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NextSectionArrow targetRef={languagesRef} label="View skills" />
      </section>

      {/* LANGUAGES */}
      <section ref={languagesRef} className="section-dark gold-glow relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-20 pb-32 sm:pt-24 sm:pb-40">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center sm:px-6">
          <Reveal variant="scale">
            <SectionHeading>Languages & Tools</SectionHeading>
            <MotionText className="mt-3 max-w-xl text-sm text-muted sm:mt-4 sm:text-base">
              The stack I build with every day — from low-level C/C++ to the full MERN stack and React Native.
            </MotionText>
            <div className="mt-8 sm:mt-12"><FloatingTechRow items={floatingIcons} /></div>
            <div className="mt-6 mb-10 sm:mt-8 sm:mb-14"><LanguageList items={floatingIcons} /></div>
          </Reveal>
        </div>
        <NextSectionArrow targetRef={projectsRef} label="View projects" />
      </section>

      {/* ABOUT */}
      <section ref={projectsRef} className="section-darker gold-glow relative min-h-[80dvh] pt-20 pb-24 sm:min-h-screen sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <Reveal delay={80}>
            <SectionHeading>About</SectionHeading>
            <MotionText className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
              I started building software to understand how the tools I used every day actually worked underneath.
              That curiosity pulled me toward both full-stack development and security — one teaches you how systems
              are built, the other teaches you how they break. Somewhere between the two is where I try to work.
            </MotionText>
          </Reveal>
        </div>
      </section>

      {/* PROJECTS */}
      {projects.map((project, i) => (
        <ProjectSection key={project.id} project={project} index={i} />
      ))}

      {/* BROWSE BY PROJECT */}
      <section ref={avatarsRef} className="section-dark gold-glow relative flex min-h-[100dvh] flex-col justify-center pt-20 pb-28 sm:pt-24 sm:pb-36">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-6">
          <Reveal variant="scale">
            <SectionHeading>Browse by Project</SectionHeading>
            <div className="mt-8 sm:mt-12">
              <AvatarSelector items={projects} />
            </div>
          </Reveal>
        </div>
        <NextSectionArrow targetRef={thanksRef} label="Finish" />
      </section>

      {/* THANK YOU */}
      <section ref={thanksRef} className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-20 pb-28 sm:pt-24 sm:pb-32">
        <video autoPlay muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/thanks-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 mx-auto w-full max-w-3xl px-5 text-center sm:px-6">
          <Reveal variant="scale">
            <h2 className="font-display text-[clamp(1.7rem,5vw,2.8rem)] tracking-tight text-white">
              Thank you for visiting
            </h2>
            <MotionText className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              I appreciate you taking the time to look through my work. I'm open to internships and collaborative projects — feel free to reach out.
            </MotionText>
            <a href="mailto:abseryousuf50@gmail.com" className="mt-8 inline-flex items-center gap-2 text-sm text-accent transition-all duration-300 hover:gap-3 sm:mt-10">
              abseryousuf50@gmail.com
              <ArrowIcon className="h-4 w-4 -rotate-45" />
            </a>
          </Reveal>
        </div>

        <button
          onClick={() => scrollTo(heroRef)}
          aria-label="Back to top"
          className="group absolute bottom-8 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-white/10 hover:text-accent sm:bottom-10 sm:h-11 sm:w-11"
        >
          <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] py-8 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-6">
          <p className="text-xs text-white/40 sm:text-sm">© {new Date().getFullYear()} Abser Yousuf. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="https://github.com/AbserYousuf" target="_blank" rel="noreferrer" className="text-white/50 transition-colors hover:text-white">
              <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a href="https://www.linkedin.com/in/abser-yousuf-69a56137b" target="_blank" rel="noreferrer" className="text-white/50 transition-colors hover:text-white">
              <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a href="mailto:abseryousuf50@gmail.com" className="text-white/50 transition-colors hover:text-white">
              <MailIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
