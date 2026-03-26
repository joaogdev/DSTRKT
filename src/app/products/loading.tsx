export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 border-b-2 border-white pb-8">
          <div className="h-3 w-32 animate-shimmer mb-4" />
          <div className="h-16 w-80 max-w-full animate-shimmer" />
        </div>

        <div className="border border-[#333] bg-[#050505] p-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-12 animate-shimmer" />
            <div className="h-12 animate-shimmer" />
            <div className="h-12 animate-shimmer" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#333] border border-[#333]">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-black p-4 flex flex-col gap-4">
              <div className="h-80 animate-shimmer" />
              <div className="h-4 w-1/2 animate-shimmer" />
              <div className="h-6 w-3/4 animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
