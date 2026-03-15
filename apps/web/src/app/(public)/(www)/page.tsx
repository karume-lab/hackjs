import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@repo/ui/web/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/web/components/ui/card";
import dayjs from "dayjs";
import { Globe, Layers, Rocket, ShieldCheck, Smartphone, Zap } from "lucide-react";
import Link from "next/link";
import SiteLogo from "@/components/shared/SiteLogo";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import NavigationPill from "@/features/www/components/NavigationPill";
import TestimonialsCarousel from "@/features/www/components/TestimonialsCarousel";

const features = [
  {
    title: "Blazing Fast Performance",
    description:
      "Powered by Next.js 16 and Turbopack for instant feedback and optimal Lighthouse scores.",
    icon: <Zap className="size-6 text-primary" />,
  },
  {
    title: "End-to-End Type Safety",
    description:
      "Seamless synchronization between server and client with Elysia + Eden Treaty. Say goodbye to manual types.",
    icon: <ShieldCheck className="size-6 text-primary" />,
  },
  {
    title: "Monorepo Ready",
    description:
      "Built on Turborepo to efficiently scale sharing code between web, mobile, and APIs.",
    icon: <Layers className="size-6 text-primary" />,
  },
  {
    title: "Cross-Platform",
    description: "Includes a complete React Native Expo setup alongside Next.js for maximum reach.",
    icon: <Smartphone className="size-6 text-primary" />,
  },
  {
    title: "Production Ready",
    description:
      "Out-of-the-box Drizzle ORM, secure authentication, and a robust project architecture.",
    icon: <Rocket className="size-6 text-primary" />,
  },
  {
    title: "Cloud Native",
    description: "Optimized for modern serverless hosting and scalable backend workflows.",
    icon: <Globe className="size-6 text-primary" />,
  },
];

const WWWPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <NavigationPill />
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 flex items-center gap-2">
        <ThemeSwitch />
        <Button asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>

      <main className="flex-1 w-full mx-auto">
        <section
          id="hero"
          className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 px-6"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
            <SiteLogo className="size-24" />

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight leading-tight sm:text-7xl lg:text-8xl sm:leading-[1.1] lg:leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
              Build faster with
              <br className="hidden sm:block" />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                HackJS
              </span>
            </h1>

            <p className="mb-10 max-w-2xl mx-auto text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The ultimate monorepo template for modern robust applications. Featuring Turborepo,
              Next.js, React Native, Elysia, and Drizzle.
            </p>

            <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row justify-center items-center">
              <Button asChild variant="outline">
                <Link href={"/docs/architecture"}>View Architecture</Link>
              </Button>
              <Button asChild>
                <Link href={"/docs/getting-started"}>Start Building</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="py-20 px-6 sm:py-32 bg-secondary/30 relative border-t border-b border-border/50"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
                Everything you need
              </h2>
              <p className="text-lg text-muted-foreground">
                We've spent thousands of hours refining the perfect tech stack so you don't have to.
                Connect the puzzle pieces seamlessly.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group"
                >
                  <CardHeader>
                    <div className="mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="py-20 px-6 sm:py-32 text-center relative max-w-7xl mx-auto overflow-hidden"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-16">
            Loved by developers
          </h2>

          <TestimonialsCarousel />
        </section>
      </main>

      <footer className="border-t border-border/50 bg-card py-12 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 sm:col-span-2">
            <div className="flex flex-row items-center gap-3">
              <div className="size-16 flex items-center justify-center">
                <SiteLogo />
              </div>
              <span className="font-bold text-2xl tracking-tight">HackJS</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering developers to build incredible fullstack applications without the
              boilerplate hassle.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="https://github.com/karume-lab/hackjs"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiGithub className="size-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/docs/getting-started" className="hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/docs/architecture" className="hover:text-primary transition-colors">
                  Architecture
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Developer</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="https://github.com/karume-lab"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://karume.vercel.app/core/daniel-karume-resume.pdf"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  Resume
                </Link>
              </li>
              <li>
                <Link
                  href="https://karume.vercel.app/"
                  target="_blank"
                  className="hover:text-primary transition-colors"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {dayjs().year()} HackJS. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Designed and Made with <span className="inline-block animate-bounce">🗿</span>, by yours
            truly (me)*.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WWWPage;
