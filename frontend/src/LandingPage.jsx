import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="absolute left-1/2 top-[-250px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[140px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>

          <span className="text-lg font-semibold tracking-tight">
            recover.ai
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <Link
            to="/"
            className="transition hover:text-white"
          >
            Product
          </Link>

          <Link
            to="/how-it-works"
            className="transition hover:text-white"
          >
            How it works
          </Link>

          <Link
            to="/how-it-works"
            className="transition hover:text-white"
          >
            Technology
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
          >
            Sign in
          </Link>

          <Link
            to="/how-it-works"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            AI Revenue Recovery Platform
          </div>

          {/* Heading */}
          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[88px]">
            Recover lost revenue
            <br />
            <span className="text-zinc-500">
              with intelligent automation.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
            An AI-powered platform that detects failed payments, creates
            recovery cases, and executes bounded recovery workflows using
            policies, customer context, and AI-driven decision making.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/how-it-works"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Explore the project

              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M4 10h12M11 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              to="/login"
              className="w-full rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/[0.08] sm:w-auto"
            >
              Sign in
            </Link>
          </div>

          {/* Tech stack */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {[
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Socket.IO",
              "LLM",
              "RAG",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Product Preview */}
        <div className="relative mx-auto mt-24 max-w-6xl">
          <div className="absolute -inset-10 -z-10 rounded-[40px] bg-white/[0.035] blur-3xl" />

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            {/* Browser */}
            <div className="flex h-12 items-center border-b border-white/10 bg-zinc-900/80 px-4">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>

              <div className="mx-auto hidden rounded-md border border-white/5 bg-black px-20 py-1.5 text-[10px] text-zinc-600 sm:block">
                recover.ai / dashboard
              </div>

              <div className="w-12" />
            </div>

            {/* Dashboard */}
            <div className="grid min-h-[500px] grid-cols-1 md:grid-cols-[190px_1fr]">
              {/* Sidebar */}
              <aside className="hidden border-r border-white/10 bg-zinc-950 p-4 md:block">
                <div className="mb-8 text-xs font-semibold text-zinc-500">
                  RECOVER.AI
                </div>

                <div className="space-y-1">
                  {[
                    "Overview",
                    "Recovery Cases",
                    "Customers",
                    "AI Agent",
                    "Audit Trail",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2.5 text-xs ${
                        index === 0
                          ? "bg-white/10 text-white"
                          : "text-zinc-500"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/5 pt-5">
                  <div className="mb-3 text-[10px] uppercase tracking-widest text-zinc-600">
                    System
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Event processor
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                    Recovery engine
                  </div>
                </div>
              </aside>

              {/* Main */}
              <div className="p-5 sm:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Recovery workspace
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Recovery cases
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      AI-assisted payment recovery workflow
                    </p>
                  </div>

                  <div className="flex h-fit items-center gap-2 rounded-lg border border-white/10 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    <span className="text-xs text-zinc-400">
                      Agent active
                    </span>
                  </div>
                </div>

                {/* Recovery event */}
                <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div>
                      <p className="text-xs font-medium text-white">
                        Payment recovery event
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        Payment failed · Recovery case created
                      </p>
                    </div>

                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] text-zinc-400">
                      PROCESSING
                    </span>
                  </div>

                  {/* Workflow */}
                  <div className="p-4">
                    <div className="space-y-3">
                      <WorkflowStep
                        number="01"
                        title="Payment event detected"
                        description="Failed payment received by the event processor."
                        status="Completed"
                      />

                      <WorkflowStep
                        number="02"
                        title="Recovery policy retrieved"
                        description="RAG retrieves the relevant recovery policy and constraints."
                        status="Completed"
                      />

                      <WorkflowStep
                        number="03"
                        title="AI agent evaluates case"
                        description="Customer and payment history are analyzed before action."
                        status="Running"
                      />

                      <WorkflowStep
                        number="04"
                        title="Bounded recovery action"
                        description="Retry, outreach, or escalation based on policy."
                        status="Pending"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom cards */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                      AI decision
                    </p>

                    <p className="mt-3 text-sm text-zinc-300">
                      Recovery action selected using customer context and
                      retrieved policy.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                      Audit trail
                    </p>

                    <p className="mt-3 text-sm text-zinc-300">
                      Policy retrieval, decision, action, and outcome are
                      recorded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project summary */}
      <section className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                The project
              </p>

              <h2 className="mt-4 max-w-sm text-3xl font-semibold tracking-tight">
                Intelligent recovery, built with guardrails.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Feature
                title="AI + RAG"
                text="Retrieves relevant recovery policies and uses customer/payment context to guide decisions."
              />

              <Feature
                title="Tool calling"
                text="The agent can execute bounded actions such as payment retries, outreach, and escalation."
              />

              <Feature
                title="Idempotent events"
                text="Duplicate payment events are safely handled to prevent repeated recovery workflows."
              />

              <Feature
                title="Real-time + audit"
                text="Recovery activity is streamed with Socket.IO and recorded for transparent AI decisions."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Workflow item */
function WorkflowStep({ number, title, description, status }) {
  return (
    <div className="flex gap-4 rounded-lg border border-white/5 bg-black/30 p-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-[9px] text-zinc-500">
        {number}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-zinc-300">{title}</p>

          <span
            className={`text-[9px] uppercase tracking-wider ${
              status === "Completed"
                ? "text-zinc-300"
                : status === "Running"
                  ? "text-white"
                  : "text-zinc-700"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="mt-1 text-[10px] leading-4 text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
}

/* Feature item */
function Feature({ title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="text-sm font-medium text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
    </div>
  );
}