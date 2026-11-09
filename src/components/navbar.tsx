import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-2 sm:px-6">
      {/* Main Navbar */}
      <div className="
        max-w-7xl mx-auto
        mt-2 sm:mt-3
        flex
        items-center
        justify-between
        px-3 sm:px-6
        py-3 sm:py-4.5
        bg-white
        border
        border-slate-200/80
        shadow-md
        rounded-2xl
      ">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="
              w-12
              h-12
              sm:w-18
              sm:h-18
              object-contain
              rounded-full
              cursor-pointer
              hover:scale-[1.03]
              transition-transform
              duration-300
            "
          />
        </div>

        {/* Desktop Menu */}
        <ul className="
          hidden
          lg:flex
          items-center
          gap-10
          text-orange-500
          font-medium
        ">
          <li className="cursor-pointer hover:text-blue-900 hover:scale-105 transition-all duration-200">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-900 hover:scale-105 transition-all duration-200">
            <Link to="/about">About</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-900 hover:scale-105 transition-all duration-200">
            <Link to="/services">Services</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-900 hover:scale-105 transition-all duration-200">
            <Link to="/colleges">Colleges</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-900 hover:scale-105 transition-all duration-200">
            <Link to="/blogs">Blogs</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-900 hover:scale-105 transition-all duration-200">
            <Link to="/admin">Admin</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-900 hover:scale-105 transition-all duration-200">
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="
            lg:hidden
            text-orange-500
            text-2xl
            cursor-pointer
            hover:text-blue-900
            hover:scale-110
            transition-all
            duration-200
            p-1
          "
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden
          mt-2
          p-3.5
          bg-white
          border
          border-slate-200/80
          rounded-2xl
          shadow-xl
          text-slate-800
          transition-all
          duration-300
          ${
            open
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none"
          }
        `}
      >
        <ul className="flex flex-col gap-3 font-medium text-sm">
          <li className="cursor-pointer text-slate-700 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 border-b border-slate-100 pb-1.5">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          </li>
          <li className="cursor-pointer text-slate-700 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 border-b border-slate-100 pb-1.5">
            <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          </li>
          <li className="cursor-pointer text-slate-700 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 border-b border-slate-100 pb-1.5">
            <Link to="/services" onClick={() => setOpen(false)}>Services</Link>
          </li>
          <li className="cursor-pointer text-slate-700 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 border-b border-slate-100 pb-1.5">
            <Link to="/colleges" onClick={() => setOpen(false)}>Colleges</Link>
          </li>
          <li className="cursor-pointer text-slate-700 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 border-b border-slate-100 pb-1.5">
            <Link to="/blogs" onClick={() => setOpen(false)}>Blogs</Link>
          </li>
          <li className="cursor-pointer text-slate-700 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 border-b border-slate-100 pb-1.5">
            <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
          </li>
          <li className="cursor-pointer text-slate-700 hover:text-orange-500 hover:translate-x-1 transition-all duration-200">
            <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
