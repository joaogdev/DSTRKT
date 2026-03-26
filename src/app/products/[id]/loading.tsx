export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-80px)] border-b border-[#333]">
        <div className="w-full lg:w-[70%] border-r border-[#333] bg-[#050505] p-6 lg:p-12">
          <div className="h-full min-h-[60vh] lg:min-h-[calc(100vh-80px)] animate-shimmer" />
        </div>
        <div className="w-full lg:w-[30%] bg-[#0a0a0a] p-8 lg:p-12">
          <div className="h-6 w-24 animate-shimmer mb-6" />
          <div className="h-16 w-full animate-shimmer mb-8" />
          <div className="h-10 w-40 animate-shimmer mb-8" />
          <div className="h-32 w-full animate-shimmer mb-10" />
          <div className="h-14 w-full animate-shimmer mb-4" />
          <div className="h-16 w-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
