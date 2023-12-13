import './globals.css'
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import FilterMenu from './components/FilterMenu';
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";

export const metadata = {
  title: 'Real Estate Rental',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <section>
          <div className="flex items-center border-solid border-b-2 border-zinc-700 bg-black">
            <Logo />
            <span className="flex grow"><NavBar /></span>
          </div>
          <div className="flex">
            <FilterMenu />
            {children}
          </div>
        </section>
      </body>
    </html>
  )
}