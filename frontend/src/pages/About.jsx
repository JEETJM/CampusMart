import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  ShoppingBag,
  Sparkles,
  Users,
  Code2,
} from "lucide-react";

// Team members
const teamMembers = [
  {
    name: "Jeet Mondal",
    role: "Team Leader · Full Stack Developer",
    bio: "Leading the project and working on building the CampusMart AI experience.",
    image: "/images/team/Jeet.png",
    github: "https://github.com/JEETJM",
    linkedin: "https://www.linkedin.com/in/jm1904/",
    email: "jm382118@gmail.com",
  },
  {
    name: "Annesha Mondal",
    role: "Frontend Developer",
    bio: "Contributing to the user interface and responsive design.",
    image: "/images/team/Annesha.png",
    github: "https://github.com/annesha2",
    linkedin: "https://www.linkedin.com/in/annesha-mondal-32868828b/",
    email: "anneshamondal2507@gmail.com",
  },
  {
    name: "Subarna Mondal",
    role: "Backend Developer",
    bio: "Contributing to APIs, database integration and application functionality.",
    image: "/images/team/Subarna.png",
    github: "https://github.com/Subarna5566",
    linkedin: "https://www.linkedin.com/in/subarna-mondal-800754379",
    email: "subarnamondal5566@gmail.com",
  },
  {
    name: "Imran Sk",
    role: "AI/ML & Testing",
    bio: "Contributing to AI-powered features, testing and improving the user experience.",
    image: "/images/team/Imran.jpg",
    github: "",
    linkedin: "",
    email: "isk037643@gmail.com",
  },
];

// Custom GitHub icon: does not depend on lucide-react exports
function GithubIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.62 1.22 3.26.93.1-.73.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.5 0-1.22.44-2.21 1.16-2.99-.12-.29-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.1-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.67.11 2.96.72.78 1.16 1.77 1.16 2.99 0 4.27-2.62 5.21-5.11 5.49.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

// Custom LinkedIn icon: does not depend on lucide-react exports
function LinkedInIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.265 2.369 4.265 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.56V9h3.554v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function SocialLink({ href, label, children }) {
  if (!href) return null;

  const isEmail = href.startsWith("mailto:");

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noopener noreferrer"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                 border border-white/10 bg-white/5 text-slate-300
                 transition hover:border-cyan-400/50 hover:bg-cyan-400/10
                 hover:text-cyan-300"
    >
      {children}
    </a>
  );
}

function TeamCard({ member, index }) {
  return (
    <article
      className="group overflow-hidden rounded-3xl border border-white/10
                 bg-slate-900/80 transition duration-300
                 hover:-translate-y-2 hover:border-cyan-400/40
                 hover:shadow-2xl hover:shadow-cyan-950/30"
    >
      <div className="relative h-64 overflow-hidden bg-slate-800 sm:h-72">
        <img
          src={member.image}
          alt={`Photo of ${member.name}`}
          loading="lazy"
          className="h-full w-full object-cover object-center transition
                     duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.opacity = "0";
          }}
        />

        <div
          className="absolute inset-0 bg-gradient-to-t
                     from-slate-950 via-transparent to-transparent"
        />

        <span
          className="absolute left-4 top-4 rounded-full border
                     border-white/15 bg-slate-950/70 px-3 py-1
                     text-xs font-semibold text-cyan-300 backdrop-blur"
        >
          {index === 0 ? "Team Leader" : `Team Member 0${index + 1}`}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white">{member.name}</h3>

        <p className="mt-2 text-sm font-medium text-cyan-300">{member.role}</p>

        <p className="mt-4 min-h-16 text-sm leading-6 text-slate-400">
          {member.bio}
        </p>

        <div
          className="mt-5 flex items-center gap-3 border-t
                     border-white/10 pt-5"
        >
          <SocialLink href={member.github} label={`${member.name} GitHub`}>
            <GithubIcon size={18} />
          </SocialLink>

          <SocialLink href={member.linkedin} label={`${member.name} LinkedIn`}>
            <LinkedInIcon size={18} />
          </SocialLink>

          <SocialLink
            href={member.email ? `mailto:${member.email}` : ""}
            label={`Email ${member.name}`}
          >
            <Mail size={18} />
          </SocialLink>
        </div>
      </div>
    </article>
  );
}

export default function About() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative isolate px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div
          className="absolute -left-24 top-0 -z-10 h-72 w-72
                     rounded-full bg-cyan-500/10 blur-3xl"
        />

        <div
          className="absolute -right-24 top-20 -z-10 h-80 w-80
                     rounded-full bg-violet-500/10 blur-3xl"
        />

        <div className="mx-auto max-w-5xl text-center font-sans antialiased selection:bg-cyan-500/30">
          {/* Top Badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-light tracking-widest uppercase text-cyan-300 backdrop-blur-sm">
            <Sparkles size={14} className="animate-pulse" />
            Meet the people behind CampusMart AI
          </div>

          {/* Main Heading with Light & Stylish Typography */}
          <h1 className="mt-6 text-4xl font-extralight tracking-wide text-slate-200 sm:text-6xl lg:text-5xl leading-tight">
            Great ideas start{" "}
            <span className="block mt-1 font-light bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-200 bg-clip-text text-transparent italic tracking-wider">
              with a great team.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-relaxed tracking-wide text-slate-400 sm:text-base">
            We are a team of students building a smarter campus marketplace
            where students can buy, sell, exchange and rent products with the
            help of AI.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400/90 px-6 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/10 transition duration-300 hover:bg-cyan-300 hover:shadow-cyan-500/20"
            >
              Explore Marketplace
              <ArrowRight size={16} />
            </Link>

            <a
              href="#our-team"
              className="rounded-full  border border-white/10 px-6 py-3 text-sm   font-light text-slate-300 backdrop-blur-sm transition duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Meet Our Team
            </a>
          </div>
        </div>
      </section>

      {/* Project overview */}
      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          <div
            className="rounded-2xl border border-white/10
                       bg-white/[0.03] p-6"
          >
            <ShoppingBag className="text-cyan-300" size={28} />
            <h2 className="mt-4 text-lg font-bold">Student Marketplace</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A platform for students to buy, sell, exchange and rent products.
            </p>
          </div>

          <div
            className="rounded-2xl border border-white/10
                       bg-white/[0.03] p-6"
          >
            <Sparkles className="text-violet-300" size={28} />
            <h2 className="mt-4 text-lg font-bold">AI-Powered Features</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Smarter product discovery, price guidance and shopping assistance.
            </p>
          </div>

          <div
            className="rounded-2xl border border-white/10
                       bg-white/[0.03] p-6"
          >
            <Code2 className="text-blue-300" size={28} />
            <h2 className="mt-4 text-lg font-bold">Built Together</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A student project combining web development, teamwork and AI.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="our-team" className="scroll-mt-24 px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-14">
            <div
              className="inline-flex items-center gap-2 text-sm
                         font-semibold uppercase tracking-[0.2em]
                         text-cyan-300"
            >
              <Users size={17} /> The people
            </div>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Meet Our Team
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Four people, one shared goal: making campus commerce simpler.
            </p>
          </div>

          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2
                       lg:grid-cols-4"
          >
            {teamMembers.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-5 pb-24 sm:px-8">
        <div
          className="mx-auto max-w-5xl rounded-3xl border
                     border-cyan-400/20 bg-gradient-to-r
                     from-cyan-500/10 via-blue-500/10
                     to-violet-500/10 p-8 text-center sm:p-12"
        >
          <h2 className="text-2xl font-black sm:text-4xl">
            Your Campus. Your Marketplace.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Discover what students around you have to offer.
          </p>

          <Link
            to="/marketplace"
            className="mt-7 inline-flex items-center gap-2 rounded-xl
                       bg-white px-6 py-3 font-bold text-slate-950
                       transition hover:bg-cyan-100"
          >
            Visit CampusMart AI <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
