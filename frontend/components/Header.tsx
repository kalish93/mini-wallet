import React from 'react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="w-full p-6 bg-gray-800 shadow-xl mb-6 sticky top-0 z-10 rounded-b-xl font-inter">
      <h1 className="text-3xl font-extrabold text-primary-emerald text-center">
        {title}
      </h1>
    </header>
  );
}