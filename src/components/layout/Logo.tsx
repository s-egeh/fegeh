import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  /**
   * `dark` = horizontal lockup for placing ON a dark surface (header, drawer):
   *          the FL mark beside the wordmark block, "FEGEH" in white over the
   *          gold "LOGISTICS".
   * `full-dark` = the full lockup as supplied — mark, divider bar, wordmark —
   *          with "FEGEH" in white, for the ink footer.
   * `light` = the full lockup in its original navy and gold, for light surfaces
   *          (documents, print). The site has no light header.
   * `mark` = the FL monogram and its swoosh alone, for dark surfaces (preloader).
   */
  variant?: 'dark' | 'full-dark' | 'light' | 'mark';
  size?: 'sm' | 'md';
  className?: string;
  priority?: boolean;
}

/*
 * Every file below is generated from the client's artwork by
 * scripts/build-logo-variants.mjs — see that script for how and why.
 *
 * One adjustment is made for dark surfaces, and only there: "FEGEH" is navy
 * (#112C6E) — the same colour as the header and footer it sits on — so it is
 * redrawn in white with its edges intact. Everything else in the logo is gold
 * (#FDC007), which reads at 7.90:1 on that navy and is left exactly as drawn.
 * The mark has no navy in it at all, so the dark-surface mark is the same
 * artwork as the light one.
 *
 * On light surfaces the original colours are used unchanged.
 *
 * Intrinsic sizes: mark 452x452 (the monogram is 452x348, centred on a square
 * canvas), wordmark 810x298, full lockup 1358x364.
 */
const MARK_DARK = '/brand/fegeh-logo-mark-dark.png';
const WORDMARK_WHITE = '/brand/fegeh-wordmark-white.png';
const FULL = '/brand/fegeh-logo-full.png';
const FULL_WHITE = '/brand/fegeh-logo-full-white.png';

const WORDMARK_RATIO = 298 / 810;
const FULL_RATIO = 364 / 1358;

/*
 * Display sizes: mark square and wordmark width, in CSS pixels.
 *
 * Chosen so the pair keeps the proportions of the supplied lockup, where the
 * wordmark block stands 0.86 times the height of the monogram. The monogram
 * fills 77% of its square, so a 48px square shows a 37px monogram beside a
 * 32px wordmark.
 */
const SIZES = {
  sm: { mark: 40, wordmark: 72 },
  md: { mark: 48, wordmark: 88 },
};

export function Logo({ variant = 'dark', size = 'md', className, priority = false }: LogoProps) {
  const { mark, wordmark } = SIZES[size];

  // The preloader sits on ink, so the mark alone uses the dark-surface version.
  if (variant === 'mark') {
    return (
      <Image
        src={MARK_DARK}
        alt=""
        width={mark * 2}
        height={mark * 2}
        priority={priority}
        className={cn('h-auto w-auto', className)}
      />
    );
  }

  /*
   * The full lockups are sized by the caller's height class (h-16 and so on)
   * with w-auto; the width and height given here are the footer's display
   * size, so next/image builds its srcset around that rather than the 1358px
   * source.
   */
  if (variant === 'light' || variant === 'full-dark') {
    const height = 64;
    return (
      <Image
        src={variant === 'light' ? FULL : FULL_WHITE}
        alt=""
        width={Math.round(height / FULL_RATIO)}
        height={height}
        priority={priority}
        className={cn('w-auto', className)}
      />
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src={MARK_DARK}
        alt=""
        width={mark}
        height={mark}
        priority={priority}
        className="h-auto shrink-0"
        style={{ width: mark }}
      />
      {/*
        The wordmark drops below 400px. At 360 the lockup, the quote button and
        the menu button compete for a 312px row, and the first thing to give is
        the gap between the logo and the menu button. The mark alone is
        unambiguous — it is the same artwork the favicon uses.
      */}
      <Image
        src={WORDMARK_WHITE}
        alt=""
        width={wordmark}
        height={Math.round(wordmark * WORDMARK_RATIO)}
        priority={priority}
        className="hidden h-auto shrink-0 min-[400px]:block"
        style={{ width: wordmark }}
      />
    </span>
  );
}
