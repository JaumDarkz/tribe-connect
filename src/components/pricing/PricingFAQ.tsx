/**
 * Pricing FAQ Component
 * Frequently asked questions about pricing and billing
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does billing work?',
    answer:
      'All paid plans are billed monthly on a recurring basis. Your first charge occurs when you upgrade, and subsequent charges happen on the same day each month. You can cancel anytime, and your plan will remain active until the end of your billing period.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes! You can cancel your subscription at any time from your billing settings. When you cancel, you\'ll retain access to your paid plan features until the end of your current billing period. After that, your account will automatically downgrade to the Free plan.',
  },
  {
    question: 'What happens when I cancel?',
    answer:
      'When you cancel your subscription, you keep all paid features until the end of your current billing period. After that, your account automatically downgrades to the Free plan. All your data and progress remain safe, but premium features will be locked until you upgrade again.',
  },
  {
    question: 'Do I get a refund if I downgrade?',
    answer:
      'Plan changes take effect at the end of your current billing period. If you downgrade, you won\'t be charged for the lower tier until your current subscription expires. We don\'t offer prorated refunds, but you\'ll keep access to your current plan\'s features until the period ends.',
  },
  {
    question: 'Can I switch between plans?',
    answer:
      'Absolutely! You can upgrade or downgrade at any time. Upgrades take effect immediately, and you\'ll be charged the prorated difference for the remainder of your billing period. Downgrades take effect at the end of your current billing period.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Yes! All payments are processed securely through Stripe, one of the world\'s most trusted payment processors. We never store your credit card information on our servers. Stripe is PCI-DSS Level 1 certified, the highest level of security in the payment industry.',
  },
  {
    question: 'Do premium features work across all servers?',
    answer:
      'Yes! Your premium subscription is tied to your account, not individual servers. This means all premium features (auto-farm, XP boost, etc.) work across every server where TRIBE CONNECT is installed. One subscription gives you premium benefits everywhere.',
  },
  {
    question: 'Can I pay annually for a discount?',
    answer:
      'Currently, we only offer monthly billing. Annual billing with a discount is coming soon! Join our newsletter or follow us on Discord to be notified when this feature launches.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through Stripe. Additional payment methods like PayPal and bank transfers may be added in the future.',
  },
  {
    question: 'Do you offer student or nonprofit discounts?',
    answer:
      'We\'re working on special discount programs for students, educators, and nonprofit organizations. If you represent one of these groups, please contact our support team for more information.',
  },
];

export const PricingFAQ = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked
              <span className="gradient-primary bg-clip-text text-transparent">
                {' '}
                Questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about pricing and billing
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="glassmorphism rounded-2xl p-6 md:p-8 border border-border/50">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact support */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="mailto:support@tribeconnect.com"
              className="text-primary hover:underline font-medium"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
