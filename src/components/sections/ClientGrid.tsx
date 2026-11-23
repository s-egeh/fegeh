'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { WordmarkTile } from '@/components/ui/Media';
import { CLIENTS, type Client } from '@/data/clients';
import { isImageAvailable } from '@/lib/images';

function Cell({ client, delay }: { client: Client; delay: number }) {
  const [failed, setFailed] = useState(false);
  // A logo not in the build-time image manifest shows the wordmark, with no request.
  const showWordmark = !isImageAvailable(client.logo) || failed;

  return (
    <Reveal delay={delay} className="border-b border-r border-line">
      <div className="group flex h-full flex-col items-center justify-center gap-5 p-8 text-center transition-colors duration-fast hover:bg-paper sm:p-10">
        <div className="flex h-12 items-center justify-center">
          {showWordmark ? (
            <WordmarkTile name={client.name} className="transition-colors duration-fast group-hover:text-ink-900" />
          ) : (
            <Image
              src={client.logo as string}
              alt={client.name}
              width={220}
              height={48}
              onError={() => setFailed(true)}
              className="max-h-12 w-auto object-contain grayscale transition-[filter] duration-base group-hover:grayscale-0"
            />
          )}
        </div>

        {/* A blank line, not nothing, when the sector is unknown: the name
            stays level with its neighbours in the row. */}
        <span className="u-mono text-[10px] text-slate-600" aria-hidden={client.sector ? undefined : true}>
          {client.sector ?? ' '}
        </span>
      </div>
    </Reveal>
  );
}

/*
 * Empty cells that close the last row, so the hairline grid ends square
 * instead of with a ragged edge: as many as the four-across row needs at lg,
 * of which only the two-across row's share shows at sm (none in one column).
 * Seven clients take one filler at both widths.
 */
function fillers(count: number) {
  const atLg = (4 - (count % 4)) % 4;
  const atSm = count % 2;
  return Array.from({ length: atLg }, (_, index) => (index < atSm ? 'hidden sm:block' : 'hidden lg:block'));
}

export function ClientGrid() {
  if (CLIENTS.length === 0) return null;

  return (
    <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {CLIENTS.map((client, index) => (
        <Cell key={client.name} client={client} delay={Math.min(index, 5) * 70} />
      ))}
      {fillers(CLIENTS.length).map((visibility, index) => (
        <div key={`filler-${index}`} aria-hidden="true" className={`${visibility} border-b border-r border-line`} />
      ))}
    </div>
  );
}
