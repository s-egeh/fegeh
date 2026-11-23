import { Reveal } from '@/components/motion/Reveal';
import { SwooshRule } from '@/components/motion/SwooshRule';
import { TextMask } from '@/components/motion/TextMask';
import { TextLink } from '@/components/ui/Button';
import { GhanaOutline } from '@/components/ui/GhanaOutline';
import { Eyebrow } from '@/components/ui/SectionHeader';
import { ADVANTAGES } from '@/data/operations';

export function WhyUs() {
  return (
    /*
     * overflow: clip, not hidden, where the browser supports it. Both crop the
     * outline that hangs off the right edge, but `hidden` makes the section a
     * scroll container, and a sticky element inside one sticks to the section
     * rather than to the viewport — which would stop the heading column below
     * from following the reader. Older browsers keep `hidden`.
     */
    <section
      aria-labelledby="why-heading"
      className="grain section-y relative overflow-hidden bg-ink-900 supports-[overflow:clip]:overflow-clip"
    >
      <GhanaOutline
        className="pointer-events-none absolute -right-12 top-1/2 h-[520px] w-auto -translate-y-1/2 text-white opacity-[0.06] lg:right-16"
      />

      <div className="container-site relative z-10 grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
        {/* Five columns, not four, so the heading gets a 22ch measure and
            holds to two lines at 1280 and above.

            Sticky on desktop. Five advantage rows make the right column about
            600px taller than this one; rather than leave the left side empty
            for most of the section, the heading travels with the reader until
            the last row. top-32 clears the 72px scrolled header. */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow onDark>Competitive advantage</Eyebrow>
            </Reveal>

            <SwooshRule className="mt-5" />

            <TextMask
              as="h2"
              id="why-heading"
              text="One team. Fewer handoffs."
              delay={90}
              className="mt-5 max-w-head t-h2 text-white"
            />

            {/*
              A pull quote attributed to the previous company's profile sat here.
              It returns only with a quote Fegeh Logistics has approved and can
              attribute; until then the column closes on a route into the detail.
            */}
            <Reveal delay={160} className="mt-10 block">
              <TextLink href="/services" className="text-white hover:text-gold">
                See how the services fit together
              </TextLink>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-line-dark">
            {ADVANTAGES.map((item, index) => (
              <Reveal key={item.index} delay={index * 70}>
                <div className="flex flex-col gap-4 border-b border-line-dark py-9 sm:flex-row sm:gap-10">
                  <span className="u-mono shrink-0 text-[12px] text-gold">{item.index}</span>
                  <div>
                    <h3 className="t-h4 font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 max-w-measure text-slate-400">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
