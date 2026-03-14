"use client";

import { Avatar, AvatarFallback } from "@repo/ui/web/components/ui/avatar";
import { Card, CardContent } from "@repo/ui/web/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/web/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    quote:
      "A solid fullstack template with a great Next.js and Turborepo foundation. Honestly, a really impressive setup.",
    author: "Bob",
    role: "Developer, Denmark",
    initial: "B",
  },
  {
    quote:
      "The sheer velocity this template gives us is incredible. We went from idea to production in under a week.",
    author: "Sarah Jenkins",
    role: "CTO at StartupX",
    initial: "S",
  },
  {
    quote:
      "Finally, a stack that doesn't compromise on type safety or developer experience. Highly recommended!",
    author: "Michael Chen",
    role: "Fullstack Engineer",
    initial: "M",
  },
  {
    quote:
      "The Expo integration alongside web is seamless. Sharing components and logic has never been easier.",
    author: "Elena Rodriguez",
    role: "Lead Mobile Dev",
    initial: "E",
  },
];

const TestimonialsCarousel = () => {
  return (
    <div className="max-w-4xl mx-auto relative px-12">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.author}
              className="basis-[90%] sm:basis-[80%] md:basis-[70%] lg:basis-[60%]"
            >
              <div className="p-2">
                <Card className="border-border/50 shadow-sm bg-card/40 backdrop-blur-md">
                  <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 text-center min-h-[300px]">
                    <div className="text-6xl text-primary/20 leading-none font-serif mb-4">"</div>
                    <p className="text-xl sm:text-2xl font-medium leading-relaxed italic text-foreground mb-8 text-balance">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                          {testimonial.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4 bg-background hover:bg-accent border-primary/20 hover:border-primary/50 text-foreground scale-125" />
        <CarouselNext className="hidden sm:flex -right-4 bg-background hover:bg-accent border-primary/20 hover:border-primary/50 text-foreground scale-125" />
      </Carousel>
    </div>
  );
};

export default TestimonialsCarousel;
