import Link from "next/link";
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="relative mt-32 border-t border-neutral-800/70 bg-black/40 backdrop-blur-sm
                 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(129,131,244,0.15),transparent_65%)]
                 after:pointer-events-none after:absolute after:top-0 after:left-1/2 after:h-px after:w-2/3 after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-indigo-500/50 after:to-transparent
                 rounded-t-2xl overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <h3
              className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300
                         drop-shadow-[0_0_8px_rgba(129,131,244,0.25)]"
            >
              SophiaNet
            </h3>
            <p className="max-w-sm text-sm text-neutral-400 leading-relaxed">
              Bridging handwritten memory, digital media & generative creativity
              into a living Wisdom Network.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <h4 className="mb-3 font-medium text-neutral-200">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#vision"
                    className="relative inline-block text-neutral-400 transition hover:text-indigo-300
                               after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Vision
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="relative inline-block text-neutral-400 transition hover:text-indigo-300
                               after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-medium text-neutral-200">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/SuhasKanwar/SophiaNet"
                    target="_blank"
                    rel="noreferrer"
                    className="relative inline-block text-neutral-400 transition hover:text-indigo-300
                               after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:team@sophianet.ai"
                    className="relative inline-block text-neutral-400 transition hover:text-indigo-300
                               after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Email
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-6 border-t border-neutral-800/60 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-neutral-500">
            &copy; {year} SophiaNet. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex gap-3" aria-label="Social links">
              <Link
                href="https://github.com/SuhasKanwar/SophiaNet"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="group relative flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800/70 bg-neutral-900/40
                           hover:border-indigo-500/60 hover:bg-neutral-800/60 transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-neutral-400 transition group-hover:fill-indigo-300"
                  aria-hidden="true"
                >
                  <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.08-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.56.12-3.25 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.69.24 2.94.12 3.25.77.84 1.24 1.91 1.24 3.23 0 4.63-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22 0 1.6-.02 2.88-.02 3.27 0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
                </svg>
                <span className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-purple-500/0 opacity-0 blur transition duration-500 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 group-hover:opacity-100" />
              </Link>
            </div>
            <div className="flex gap-4 text-xs text-neutral-500">
              <Link
                href="#"
                className="relative inline-block hover:text-neutral-300 transition after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-neutral-500/70 after:transition-all hover:after:w-full"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="relative inline-block hover:text-neutral-300 transition after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-neutral-500/70 after:transition-all hover:after:w-full"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}