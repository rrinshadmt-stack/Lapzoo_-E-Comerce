function Search({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search...."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mb-8 px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default Search;
