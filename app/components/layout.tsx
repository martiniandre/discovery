import { useMatches } from "@remix-run/react";
import Navbar from "./navbar";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@prisma/client";

interface LayoutProps {
  user: User | null;
  children: React.ReactNode;
}

export default function Layout({ children, user }: LayoutProps) {
  const matches = useMatches();
  const hideNav = matches.find((match) => match.handle && !match.handle.hasNav);

  return (
    <AnimatePresence mode="popLayout">
      <div id="app" className="flex flex-col">
        {hideNav ? null : <Navbar user={user} />}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full md:col-span-3 sm:overflow-auto relative z-0"
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
