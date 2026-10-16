import { Link } from "react-router-dom";
import {
  ArrowRight,
//   Github,
//   Linkedin,
  Mail,
  ShoppingBag,
  Sparkles,
  Users,
  Code2,
} from "lucide-react";

// Replace the sample names, roles, bios and links with your real details.
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
    name: "Team Member 2",
    role: "Frontend Developer",
    bio: "Contributing to the user interface and responsive design.",
    image: "/images/team/member-2.jpg",
    github: "",
    linkedin: "",
    email: "",
  },
  {
    name: "Team Member 3",
    role: "Backend Developer",
    bio: "Contributing to APIs, database integration and application functionality.",
    image: "/images/team/member-3.jpg",
    github: "",
    linkedin: "",
    email: "",
  },
  {
    name: "Team Member 4",
    role: "AI/ML & Testing",
    bio: "Contributing to AI-powered features, testing and improving the user experience.",
    image: "/images/team/member-4.jpg",
    github: "",
    linkedin: "",
    email: "",
  },
];

function SocialLink({ href, label, children }) {
  if (!href) return null;

  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
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
          {/* <SocialLink href={member.github} label={`${member.name} GitHub`}>
            <Github size={18} />
          </SocialLink> */}

          {/* <SocialLink href={member.linkedin} label={`${member.name} LinkedIn`}>
            <Linkedin size={18} />
          </SocialLink> */}

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

        <div className="mx-auto max-w-5xl text-center">
          <div
            className="mx-auto inline-flex items-center gap-2 rounded-full
                          border border-cyan-400/20 bg-cyan-400/10
                          px-4 py-2 text-sm font-medium text-cyan-300"
          >
            <Sparkles size={16} />
            Meet the people behind CampusMart AI
          </div>

          <h1
            className="mt-7 text-4xl font-black tracking-tight
                         sm:text-6xl lg:text-7xl"
          >
            Great ideas start
            <span
              className="block bg-gradient-to-r from-cyan-300
                             via-blue-400 to-violet-400 bg-clip-text
                             text-transparent"
            >
              with a great team.
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-8
                        text-slate-400 sm:text-lg"
          >
            We are a team of students building a smarter campus marketplace
            where students can buy, sell, exchange and rent products with the
            help of AI.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl
                         bg-cyan-400 px-6 py-3 font-bold text-slate-950
                         transition hover:bg-cyan-300"
            >
              Explore Marketplace <ArrowRight size={18} />
            </Link>

            <a
              href="#our-team"
              className="rounded-xl border border-white/15 px-6 py-3
                         font-semibold text-white transition
                         hover:bg-white/5"
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
