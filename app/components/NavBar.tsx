import Link from "next/Link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-4">
                <Link
                  className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
                  href="/"
                >
                  Home
                </Link>
                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <Link
                      key={index}
                      className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
                      href="/chapters/01"
                    >
                      {(index + 1 + "").padStart(2, "0")}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
