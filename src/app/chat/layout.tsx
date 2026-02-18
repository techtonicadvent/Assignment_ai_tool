export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen w-full overflow-hidden bg-gray-100">
      {children}
    </div>
  );
}
  