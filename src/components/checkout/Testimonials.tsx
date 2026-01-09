/**
 * Testimonials Component
 * Displays customer testimonials for social proof
 */

import { Star } from 'lucide-react';
import { Testimonial } from '@/types/checkout';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alex M.',
    role: 'Gold Member',
    content: 'Auto-farm changed everything. My earnings literally tripled in the first week.',
    rating: 5,
    planTier: 'gold',
  },
  {
    id: '2',
    name: 'Sarah K.',
    role: 'Diamond Member',
    content: 'The VIP perks are insane. Best investment I made for my Discord community.',
    rating: 5,
    planTier: 'diamond',
  },
  {
    id: '3',
    name: 'Mike R.',
    role: 'Silver Member',
    content: 'No more captchas and faster claims. Silver tier is the sweet spot for me.',
    rating: 5,
    planTier: 'silver',
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const tierColors = {
    silver: 'text-gray-400',
    gold: 'text-yellow-500',
    diamond: 'text-cyan-400',
    free: 'text-muted-foreground',
  };

  return (
    <div className="p-4 rounded-lg bg-background/50 border border-border/30 transition-all duration-300 hover:border-primary/30">
      <div className="flex items-center gap-1 mb-2">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p className="text-sm text-foreground/90 mb-3 leading-relaxed">
        "{testimonial.content}"
      </p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className={`text-xs ${tierColors[testimonial.planTier]}`}>
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <div className="glassmorphism rounded-xl p-6 border border-border/50">
      <h3 className="font-display font-semibold text-lg mb-4">
        What Members Say
      </h3>
      <div className="space-y-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};
