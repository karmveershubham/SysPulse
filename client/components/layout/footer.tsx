export function Footer() {
  return (
    <footer className="h-14 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="flex items-center justify-between h-full">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SysPulse. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">v1.0.0</p>
      </div>
    </footer>
  );
}