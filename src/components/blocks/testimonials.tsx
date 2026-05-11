"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/blocks/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TESTIMONIALS = [
  {
    id: "testimonial-3",
    name: "Marcus Chen",
    profession: "VP of Operations",
    rating: 5,
    description:
      "Scribe has cut our onboarding time in half. Instead of spending hours taking screenshots and writing manuals, we just record our workflows and let AI do the rest. It's magical.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "testimonial-1",
    name: "Sarah Jenkins",
    profession: "Customer Success Lead",
    rating: 5,
    description:
      "Our support tickets have dropped by 30% since we started sharing Scribe guides with our customers. The visual step-by-step format is so much easier to follow than text articles.",
    avatarUrl:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "testimonial-2",
    name: "Elena Rodriguez",
    profession: "Director of Enablement",
    rating: 5,
    description:
      "Keeping SOPs updated used to be a full-time job. With Scribe, I just edit the original guide and it updates everywhere instantly. It's completely transformed how we share knowledge.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "testimonial-4",
    name: "David Kim",
    profession: "IT Systems Admin",
    rating: 4.5,
    description:
      "I love that I can redact sensitive information automatically. We can share complex technical processes without worrying about exposing internal credentials or PII.",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
  },
]

function getReviewStarsClass(theme: string | undefined) {
  return theme === "dark" ? "text-primary" : "text-blue-500"
}

function getTextClass(theme: string | undefined) {
  return "text-muted-foreground leading-relaxed"
}

function getAvatarClass(theme: string | undefined) {
  return theme === "dark"
    ? "!size-12 border border-stone-700"
    : "!size-12 border border-stone-300"
}

function getCardVariant(theme: string | undefined): "dark" | "light" {
  return "dark"
}

export function Testimonials() {
  const { theme } = useTheme()

  return (
    <section className="relative py-16 sm:py-24 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-center text-2xl sm:text-4xl font-semibold text-white">Loved by teams</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground text-base sm:text-lg px-2">
            See what professionals are saying about how Scribe transformed their workflows.
          </p>
        </div>
        <ContainerScroll className="h-[150vh] md:h-[200vh] w-full mt-8 md:mt-16">
          <div className="sticky left-0 top-0 h-svh w-full py-12 flex items-center justify-center">
            <CardsContainer className="mx-auto h-[420px] sm:h-[450px] w-[calc(100vw-3rem)] max-w-[350px]">
              {TESTIMONIALS.map((testimonial, index) => (
                <CardTransformed
                  arrayLength={TESTIMONIALS.length}
                  key={testimonial.id}
                  variant={getCardVariant(theme)}
                  index={index}
                  role="article"
                  aria-labelledby={`card-${testimonial.id}-title`}
                  aria-describedby={`card-${testimonial.id}-content`}
                >
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
                    <ReviewStars
                      className={getReviewStarsClass(theme)}
                      rating={testimonial.rating}
                    />
                    <div className={`mx-auto w-[90%] sm:w-4/5 text-base sm:text-lg ${getTextClass(theme)}`}>
                      <blockquote cite="#">{testimonial.description}</blockquote>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className={getAvatarClass(theme)}>
                      <AvatarImage
                        src={testimonial.avatarUrl}
                        alt={`Portrait of ${testimonial.name}`}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left min-w-0">
                      <span className="block text-base sm:text-lg font-semibold tracking-tight text-white md:text-xl truncate">
                        {testimonial.name}
                      </span>
                      <span className="block text-xs sm:text-sm text-muted-foreground truncate">
                        {testimonial.profession}
                      </span>
                    </div>
                  </div>
                </CardTransformed>
              ))}
            </CardsContainer>
          </div>
        </ContainerScroll>
      </div>
    </section>
  )
}
