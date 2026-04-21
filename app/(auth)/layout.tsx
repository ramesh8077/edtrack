export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col justify-center relative items-center py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="mx-auto w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
