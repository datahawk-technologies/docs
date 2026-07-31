export type IframeProps = {
  src: string;
  title: string;
  aspectRatio?: string;
  allow?: string;
  allowFullScreen?: boolean;
  loading?: 'lazy' | 'eager';
  className?: string;
};

export function Iframe({
  src,
  title,
  aspectRatio = '16 / 9',
  allow,
  allowFullScreen = true,
  loading = 'lazy',
  className,
}: IframeProps) {
  return (
    <div
      className={`not-prose my-6 overflow-hidden rounded-lg border border-fd-border bg-fd-muted/30 ${
        className ?? ''
      }`}
      style={{ aspectRatio }}
    >
      <iframe
        src={src}
        title={title}
        loading={loading}
        allow={allow}
        allowFullScreen={allowFullScreen}
        className="h-full w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
