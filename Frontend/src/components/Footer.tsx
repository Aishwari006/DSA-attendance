export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>
          <span className="text-foreground font-medium">DSA Tracker</span> · A shared streak hub for friends.
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Tracking together since day 1
        </div>
      </div>
    </footer>
  );
}
