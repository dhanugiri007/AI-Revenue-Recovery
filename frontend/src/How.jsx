import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
            →
          </div>

          <span className="font-semibold tracking-tight">
            recover.ai
          </span>
        </Link>

        <Link
          to="/login"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
        >
          Sign in
        </Link>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center">
        <div className="mb-6 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400">
          Project Overview
        </div>

        <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
          AI Revenue Recovery
          <br />
          <span className="text-zinc-500">Platform</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-500">
          An AI-powered system designed to detect failed payments, create
          recovery cases, and execute controlled recovery workflows using
          customer context, policies, and AI reasoning.
        </p>

        {/* Stack */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
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
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-500"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          <Step
            number="01"
            title="Payment event"
            text="The platform receives a payment failure event and creates a recovery case."
          />

          <Step
            number="02"
            title="Policy + context"
            text="RAG retrieves relevant recovery policies while customer and payment history provide context."
          />

          <Step
            number="03"
            title="AI decision"
            text="The AI agent evaluates the case and determines an appropriate bounded recovery action."
          />

          <Step
            number="04"
            title="Recovery action"
            text="The agent can perform actions such as payment retry, customer outreach, or escalation."
          />

          <Step
            number="05"
            title="Guardrails"
            text="Rate limits, recovery limits, and idempotent processing prevent excessive or duplicate actions."
          />

          <Step
            number="06"
            title="Real-time audit"
            text="Socket.IO provides live recovery updates while decisions, policies, actions, and outcomes are recorded."
          />
        </div>
      </section>

      {/* Architecture */}
      <section className="border-y border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                Architecture
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                AI that can act,
                <br />
                with boundaries.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-zinc-500">
                The agent isn't given unrestricted control. Relevant policies
                are retrieved through RAG, available tools are constrained,
                and recovery limits protect the workflow from repeated or
                excessive actions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <ArchitectureRow
                label="Payment Events"
                value="Event Processor"
              />

              <ArchitectureRow
                label="Customer Context"
                value="MongoDB"
              />

              <ArchitectureRow
                label="Recovery Policies"
                value="RAG"
              />

              <ArchitectureRow
                label="AI Reasoning"
                value="LLM + Tool Calling"
              />

              <ArchitectureRow
                label="Live Updates"
                value="Socket.IO"
              />

              <ArchitectureRow
                label="Traceability"
                value="Audit Trail"
                last
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          See the system in action.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-zinc-500">
          Explore the platform and see how payment events move through the
          recovery workflow.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Sign in
          </Link>

          <Link
            to="/"
            className="rounded-full border border-white/10 px-6 py-3 text-sm text-zinc-300 hover:bg-white/5"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]">
      <div className="flex items-start gap-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-xs text-zinc-500">
          {number}
        </span>

        <div>
          <h3 className="font-medium">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function ArchitectureRow({ label, value, last }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-4 ${
        !last ? "border-b border-white/5" : ""
      }`}
    >
      <span className="text-sm text-zinc-500">{label}</span>

      <span className="text-right text-sm font-medium text-zinc-300">
        {value}
      </span>
    </div>
  );
}