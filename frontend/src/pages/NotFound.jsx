import React from "react";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

const NotFound = () => (
  <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-center px-4">
    <MdErrorOutline className="text-cyan-400 mb-4" size={48} />
    <h1 className="font-display text-3xl font-bold text-white mb-2">Page not found</h1>
    <p className="text-slate-400 mb-6 max-w-sm">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary">Back to home</Link>
  </div>
);

export default NotFound;
