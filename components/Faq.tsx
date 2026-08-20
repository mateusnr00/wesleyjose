"use client"

import { useState } from "react"

export function Faq({ items }: { items: { id: string; question?: string; answer?: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = open === index

        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-${index}`}
                className="flex w-full items-center justify-between gap-8 py-6 text-left transition-colors hover:text-gold-deep"
              >
                <span className="display text-lg lg:text-xl">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-lg text-muted transition-transform duration-400 ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </h3>

            <div id={`faq-${index}`} hidden={!isOpen}>
              <p className="max-w-2xl pb-7 text-muted">{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
