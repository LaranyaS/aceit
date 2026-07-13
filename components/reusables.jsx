export const PrimaryTitle = ({ children }) => (
  <span className="font-semibold text-foreground">
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

export function PageHeader({
  label,
  gray,
  gold,
  description,
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-24 pb-10 text-center">
      <SectionLabel>{label}</SectionLabel>

      <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl leading-tight">
        <PrimaryTitle>{gray} </PrimaryTitle>
        <AccentTitle>{gold}</AccentTitle>
      </h1>

      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </section>
  );
}