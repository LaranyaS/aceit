export const PrimaryTitle = ({ children }) => (
  <span className="text-foreground font-semibold">
    {children}
  </span>
);

export const AccentTitle = ({ children }) => (
  <span className="font-semibold text-violet-600 dark:text-violet-400">
    {children}
  </span>
);

export const SectionLabel = ({ children }) => (
  <span className="text-sm uppercase tracking-widest text-muted-foreground">
    {children}
  </span>
);