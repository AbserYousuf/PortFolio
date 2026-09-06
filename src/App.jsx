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


function SplitText({ text, className = '' }) {
  return (
    <h1 className={`hero-title font-display ${className}`}>
      {text.split('').map((char, i) => {
        const tx = (Math.random() * 800 - 400).toFixed(0)
        const ty = (Math.random() * 600 - 300).toFixed(0)
        const r  = (Math.random() * 80 - 40).toFixed(0)
        const s  = (Math.random() * 0.5 + 0.7).toFixed(2)

        return (
          <span
            key={i}
            className="letter"
            style={{
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--r': `${r}deg`,
              '--s': s,
              transitionDelay: `${i * 22}ms`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </h1>
  )
}
function MotionText({ children, className = '', as: Tag = 'p' }) {
  const [ref, visible] = useReveal({ threshold: 0.15, rootMargin: '0px' })
  return (
    <Tag ref={ref} className={`text-drift ${visible ? 'in-view' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

// --- Scroll progress ---
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
    <div className="fixed left-0 top-0 z-50 h-[2.5px] w-full bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 12px rgba(201,161,90,0.45)',
        }}
      />
    </div>
  )
}

// --- Reveal ---
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

function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
  const [ref, visible] = useReveal()
  const hiddenClass =
    variant === 'left'
      ? 'reveal-left-hidden'
      : variant === 'scale'
        ? 'reveal-scale-hidden'
        : 'reveal-hidden'

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
    <div ref={ref} className="mb-8 inline-block">
      <h2 className="font-display text-[clamp(1.5rem,4.5vw,2rem)] tracking-tight text-ink">
        {children}
      </h2>
      <span
        className={`mt-2.5 block h-[2px] origin-left bg-accent transition-all duration-700 ease-out ${
          visible ? 'w-14 scale-x-100' : 'w-0 scale-x-0'
        }`}
      />
    </div>
  )
}

function NextSectionArrow({ targetRef, label }) {
  return (
    <button
      onClick={() =>
        targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      aria-label={label || 'Scroll to next section'}
      className="group absolute inset-x-0 bottom-8 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line/80 bg-surface/40 text-muted backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:bg-surface/70 hover:text-accent hover:shadow-[0_0_20px_rgba(201,161,90,0.15)]"
    >
      <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
    </button>
  )
}

// --- Floating icons ---
const floatingIcons = [
  { src: '/cpp.png', alt: 'C++', height: 56, duration: 3.4, delay: 0 },
  { src: '/javascript.png', alt: 'JavaScript', height: 56, duration: 3.9, delay: 0.4 },
  { src: '/html5.png', alt: 'HTML5', height: 58, duration: 3.1, delay: 0.9 },
  { src: '/python.png', alt: 'Python', height: 54, duration: 4.2, delay: 0.2 },
  { src: '/react.png', alt: 'React', height: 56, duration: 3.6, delay: 1.1 },
  { src: '/tool.png', alt: 'Build tooling', height: 46, duration: 3.3, delay: 0.6 },
  { src: '/mongodb.png', alt: 'MongoDB', height: 30, duration: 4.0, delay: 1.4 },
  { src: '/express.png', alt: 'Express', height: 22, duration: 3.7, delay: 0.3 },
  { src: '/node.png', alt: 'Node.js', height: 38, duration: 3.5, delay: 0.8 },
]

function FloatKeyframes() {
  return (
    <style>{`
      @keyframes floatUpDown {
        0%, 100% { transform: translateY(0px); }
        50%      { transform: translateY(-18px); }
      }
    `}</style>
  )
}

function FloatingTechRow({ items }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 px-4 py-8 sm:gap-x-16">
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
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {items.map((item) => (
        <span
          key={item.alt}
          className="text-[13px] tracking-wide text-muted/80 transition-colors hover:text-accent"
        >
          {item.alt}
        </span>
      ))}
    </div>
  )
}

// --- Projects ---
const projects = [
  {
    id: 'textutils',
    name: 'TextUtils',
    icon: '/TextUtilis.png',
    tech: ['React', 'JavaScript'],
    description:
      'A text utility web app for everyday text cleanup — convert between upper/lower case, trim extra spaces, count words and characters, and preview the result instantly as you type.',
    link: 'https://text-utilis-app.netlify.app/',
  },
  {
    id: 'serabo',
    name: 'ChatBot Serabo',
    icon: '/Serabo.png',
    tech: ['React', 'Node.js', 'API integration'],
    description:
      'A conversational AI chatbot built to handle text-based Q&A and everyday conversation. It currently works with text only — image and file support are on the roadmap.',
    link: 'https://sereboaai-two.vercel.app/',
  },
  {
    id: 'newsmonkey',
    name: 'NewsMonkey',
    icon: '/NewsGorilla.png',
    tech: ['React', 'REST API'],
    description:
      'A news reader app that pulls live headlines and articles by category, with pagination so you can keep browsing without the page slowing down.',
    link: 'https://newsgorila.netlify.app/',
  },
  {
    id: 'inotebook',
    name: 'iNotebook',
    icon: '/inotebook.png',
    tech: ['MERN Stack', 'JWT Auth'],
    description:
      'A full-stack note-taking app with user authentication — each user logs in securely and manages their own private notes, with full CRUD backed by Node.js and MongoDB.',
    link: 'https://inotebook-seeker.netlify.app/',
  },
  {
    id: 'owlping',
    name: 'OwlPing',
    icon: '/Ealhs.jpg',
    tech: ['React Native', 'Socket.io', 'Node.js'],
    description:
      'A real-time messaging Android app built to understand modern chat architecture — instant delivery, live connection handling, OTP verification, and clean session management.',
    link: 'https://github.com/AbserYousuf/OwlPing/releases/download/v1.0/OwlPing.apk',
  },
]

function ProjectDetail({ project, index }) {
  return (
    <Reveal delay={index * 70}>
      <div className="project-card card-3d group border-b border-line/50 py-9 first:pt-0 last:border-b-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-display text-[1.6rem] tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-[1.75rem]">
              {project.name}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-accent/85">
              {project.tech.map((t) => (
                <span key={t} className="tracking-wide">{t}</span>
              ))}
            </div>
          </div>
          <a
            href={project.link}
            download={project.id === 'owlping' ? 'OwlPing.apk' : undefined}
  target={project.id === 'owlping' ? undefined : '_blank'}
            className="group/link flex shrink-0 items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            {project.id === 'owlping' ? 'Download' : 'View'}
            <ArrowIcon className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
        </div>
        <MotionText className="mt-3.5 max-w-xl leading-relaxed text-muted/95 text-3d">{project.description}</MotionText>
      </div>
    </Reveal>
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
    <div>
      <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-7">
        {items.map((p) => {
          const isActive = p.id === activeId
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="flex flex-col items-center gap-2.5 focus:outline-none"
            >
              <span
                className={`avatar-3d flex items-center justify-center overflow-hidden rounded-full border-2 ${
                  isActive
                    ? 'active avatar-active h-[84px] w-[84px] border-accent shadow-[0_0_0_5px_rgba(201,161,90,0.12)]'
                    : 'h-16 w-16 border-line hover:border-accent/40'
                }`}
              >
                {p.icon ? (
                  <img src={p.icon} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-lg text-ink">{p.name[0]}</span>
                )}
              </span>
              <span className={`text-xs transition-colors duration-300 ${isActive ? 'text-ink' : 'text-muted'}`}>
                {p.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-line/80 bg-surface/50 p-5 backdrop-blur-sm sm:mt-9 sm:flex-row sm:items-start sm:gap-6 sm:p-7">
        <div
          key={fadeKey}
          className="flex h-24 w-24 shrink-0 animate-[fadein_0.55s_ease-out] items-center justify-center overflow-hidden rounded-2xl border border-line bg-bg"
        >
          {active.icon ? (
            <img src={active.icon} alt={active.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-3xl text-ink">{active.name[0]}</span>
          )}
        </div>
        <div key={`text-${fadeKey}`} className="animate-[fadein_0.55s_ease-out]">
          <h4 className="font-display text-xl tracking-tight text-ink">{active.name}</h4>
          <MotionText className="mt-3 max-w-xl leading-relaxed text-muted text-3d">{active.description}</MotionText>
        </div>
      </div>
    </div>
  )
}

// --- Lightweight 3D tilt for profile ---
function ProfileTilt({ children }) {
  const ref = useRef(null)
  const frame = useRef(null)

  const handleMove = (e) => {
    if (frame.current) cancelAnimationFrame(frame.current)

    frame.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const midX = rect.width / 2
      const midY = rect.height / 2

      const rotateY = ((x - midX) / midX) * 7
      const rotateX = ((midY - y) / midY) * 6

      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`
    })
  }

  const handleLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current)
    const el = ref.current
    if (el) {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)'
    }
  }

  return (
    <div
      ref={ref}
      className="profile-3d"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}

// --- Main App ---
export default function App() {
  const aboutRef = useRef(null)
  const languagesRef = useRef(null)
  const projectsRef = useRef(null)
  const avatarsRef = useRef(null)
  const thanksRef = useRef(null)
  const [profileHovered, setProfileHovered] = useState(false)

  return (
    <div className="bg-bg font-body text-ink antialiased">
      <ScrollProgress />
      <FloatKeyframes />

      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-line/30 bg-bg/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[880px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-8 sm:py-4">
          <div>
            <span className="font-display text-base tracking-tight text-ink sm:text-lg">Abser Yousuf</span>
            <MotionText className="hover-gold text-[11px] text-muted text-3d sm:text-xs">Full-stack developer · Srinagar</MotionText>
          </div>
          <a
            href="https://www.linkedin.com/in/abser-yousuf-69a56137b"
            target="_blank"
            rel="noreferrer"
            className="group flex shrink-0 items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            LinkedIn
            <ArrowIcon className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section
        ref={aboutRef}
        className="relative flex min-h-screen flex-col justify-center pt-20 sm:pt-24 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,161,90,0.09), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(30,35,50,0.4), transparent)
          `,
          backgroundColor: '#0C0D11',
        }}
      >
        {/* Full-hero expanded profile (appears on hover of the small card) */}
        <div className={`hero-profile-expand ${profileHovered ? 'visible' : ''}`}>
          {/* Always-present tint so the hover effect is visible even before
              a real /profile.jpg exists. Sits behind the photo. */}
          <div className="hero-profile-expand-fallback" />

          <img
            src="/profile.jpg"
            alt=""
            aria-hidden="true"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        <div className="perspective-wrapper mx-auto grid w-full max-w-[880px] grid-cols-1 items-center gap-10 px-5 sm:px-8 sm:gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-10">
          
          {/* Left side - Text */}
          <div className="animate-rise relative z-10">
            <SplitText
              text="I build systems end to end, then look for where they break."
              className="text-[clamp(2rem,7vw,3.25rem)] leading-[1.15] tracking-tight text-ink sm:leading-[1.1]"
            />
            <MotionText className="mt-6 max-w-md leading-relaxed text-muted text-3d">d
              Full-stack developer working across the MERN stack and C/C++, with a growing focus on
              cybersecurity. Currently studying BCA at Islamia College of Science &amp; Commerce,
              Srinagar.
            </MotionText>
            <div className="mt-8 flex items-center gap-5">
              <a href="mailto:abseryousuf50@gmail.com" aria-label="Email" className="text-muted transition-all duration-300 hover:scale-110 hover:text-accent">
                <MailIcon className="h-5 w-5" />
              </a>
              <a href="https://github.com/AbserYousuf" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted transition-all duration-300 hover:scale-110 hover:text-accent">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/abser-yousuf-69a56137b " target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted transition-all duration-300 hover:scale-110 hover:text-accent">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right side - Profile Card */}
          <div className="relative animate-rise h-full" style={{ animationDelay: '180ms' }}>
            <div
              className="pointer-events-none absolute inset-0 -z-10 animate-[pulseGlow_7s_ease-in-out_infinite] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(201,161,90,0.28), transparent 68%)' }}
            />

            <div
              className="profile-card overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
              onMouseEnter={() => setProfileHovered(true)}
              onMouseLeave={() => setProfileHovered(false)}
            >
              <img
                src="/profile.jpg"
                alt="Abser Yousuf"
                className="aspect-[4/5] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'flex'
                }}
              />
              <div
                className="hidden aspect-[4/5] w-full flex-col items-center justify-center gap-2 text-muted"
                style={{ display: 'none' }}
              >
                <span className="text-sm">Add your photo</span>
                <span className="text-xs text-muted/70">public/profile.jpg</span>
              </div>
            </div>
          </div>
        </div>

        <NextSectionArrow targetRef={languagesRef} label="View languages & tools" />
      </section>

      {/* Languages */}
      <section
  ref={languagesRef}
  className="glass-section h-screen-safe relative flex flex-col justify-center overflow-hidden pt-20 sm:pt-24"
  style={{
    background: `
      linear-gradient(180deg, rgba(15,18,25,0.72) 0%, rgba(11,14,20,0.78) 100%),
      radial-gradient(ellipse 80% 60% at 50% 20%, rgba(201,161,90,0.06), transparent 70%)
    `,
  }}
>
        <div className="mx-auto flex w-full max-w-[880px] flex-col items-center px-6 text-center sm:px-8">
          <Reveal className="flex flex-col items-center" variant="scale">
            <SectionHeading>Languages &amp; tools</SectionHeading>
            <MotionText className=" hover-gold max-w-xl leading-relaxed text-muted text-3d">
              The stack I build with day to day — from low-level C/C++ to the MERN stack for full-stack web apps.
            </MotionText>
            <div className="mt-8">
              <FloatingTechRow items={floatingIcons} />
            </div>
            <div className="mt-5">
              <LanguageList items={floatingIcons} />
            </div>
          </Reveal>
        </div>
        <NextSectionArrow targetRef={projectsRef} label="View projects" />
      </section>

      {/* About + Projects */}
      <section
  ref={projectsRef}
  className="glass-section relative min-h-screen pb-28 pt-28"
  style={{
    background: `
      linear-gradient(180deg, rgba(11,14,20,0.75) 0%, rgba(13,16,24,0.8) 50%, rgba(15,18,26,0.82) 100%),
      radial-gradient(ellipse 70% 50% at 50% 10%, rgba(201,161,90,0.05), transparent 65%)
    `,
  }}
>
        <div className="mx-auto max-w-[880px] px-6 sm:px-8">
          <Reveal>
            <SectionHeading>About</SectionHeading>
            <MotionText className="hover-red max-w-xl leading-relaxed text-muted text-3d">
              I started building software to understand how the tools I used every day actually worked underneath.
              That curiosity pulled me toward both full-stack development and security — one teaches you how systems
              are built, the other teaches you how they break. Somewhere between the two is where I try to work.
            </MotionText>
          </Reveal>

          <div className="mt-20">
            <Reveal>
              <SectionHeading>Selected work</SectionHeading>
            </Reveal>
            <div className="mt-2">
              {projects.map((project, i) => (
                <ProjectDetail key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        </div>
        <NextSectionArrow targetRef={avatarsRef} label="Browse projects by icon" />
      </section>

      {/* Avatar browser */}
      <section
        ref={avatarsRef}
        className="relative flex min-h-screen flex-col justify-center pt-24"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 30%, rgba(201,161,90,0.06), transparent),
            linear-gradient(180deg, #12100E 0%, #0F0D0B 100%)
          `,
        }}
      >
        <div className="mx-auto w-full max-w-[880px] px-6 sm:px-8">
          <Reveal variant="scale">
            <SectionHeading>Browse by project</SectionHeading>
            <AvatarSelector items={projects} />
          </Reveal>
        </div>
        <NextSectionArrow targetRef={thanksRef} label="Finish" />
      </section>

      {/* Closing */}
      <section
  ref={thanksRef}
  className="glass-section relative flex min-h-screen flex-col justify-center pt-24"
  style={{
    background: `
      linear-gradient(180deg, rgba(10,11,13,0.78) 0%, rgba(6,7,8,0.85) 100%),
      radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,161,90,0.08), transparent 70%)
    `,
  }}
>
        <div className="mx-auto w-full max-w-[880px] px-6 sm:px-8">
          <Reveal variant="scale">
            <footer className="text-center">
              <h2 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] tracking-tight text-ink">
                Thank you for visiting
              </h2>
              <MotionText className=" hover-blue mx-auto mt-5 max-w-md leading-relaxed text-muted text-3d">
                I appreciate you taking the time to look through my work. I'm open to internships and collaborative
                projects — feel free to reach out, I'd be glad to talk.
              </MotionText>
              <a
                href="mailto:abseryousuf50@gmail.com"
                className="mt-7 inline-flex items-center gap-2 text-accent transition-all duration-300 hover:gap-3 hover:opacity-80"
              >
                abseryousuf50@gmail.com
                <ArrowIcon className="h-4 w-4 -rotate-45" />
              </a>
            </footer>
          </Reveal>
        </div>

        <button
          onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Back to top"
          className="group absolute inset-x-0 bottom-8 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line/80 bg-surface/40 text-muted backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:text-accent hover:shadow-[0_0_20px_rgba(201,161,90,0.15)]"
        >
          <ChevronUpIcon className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </section>
    </div>
  )
}