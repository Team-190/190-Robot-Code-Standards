import { JSX } from 'react';
import styles from './styles.module.css';

type GoogleSlidesEmbedProps = {
  /**
   * URL of a native Google Slides presentation (edit link, view link, or
   * share link) or a bare presentation ID. The file must actually be saved
   * in Google Slides format (Drive > File > Save as Google Slides) — a raw
   * .pptx opened in Office compatibility mode will not embed correctly.
   */
  url: string;
  /** Delay in milliseconds between auto-advancing slides. Omit to disable autoplay. */
  autoAdvanceMs?: number;
  /** Loop back to the first slide after the last one when auto-advancing. */
  loop?: boolean;
};

function extractPresentationId(url: string): string {
  const match = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return match[1];
  }
  // Assume the caller already passed a bare presentation ID.
  return url;
}

export default function GoogleSlidesEmbed({
  url,
  autoAdvanceMs,
  loop = false,
}: GoogleSlidesEmbedProps): JSX.Element {
  const presentationId = extractPresentationId(url);
  const params = new URLSearchParams({
    start: String(autoAdvanceMs !== undefined),
    loop: String(loop),
    delayms: String(autoAdvanceMs ?? 3000),
  });
  const embedSrc = `https://docs.google.com/presentation/d/${presentationId}/embed?${params.toString()}`;

  return (
    <div className={styles.slideEmbedContainer}>
      <iframe
        src={embedSrc}
        className={styles.slideEmbedFrame}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
