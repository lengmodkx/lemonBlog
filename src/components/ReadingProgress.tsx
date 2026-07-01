'use client';

export default function ReadingProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-border">
      <div
        className="h-full bg-accent origin-left"
        style={{
          animationName: 'reading-progress',
          animationDuration: '1ms',
          animationFillMode: 'both',
          animationTimingFunction: 'linear',
          animationTimeline: 'scroll(root)',
        }}
      />
    </div>
  );
}
