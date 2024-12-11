"use client";

import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './src/Redux/provider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Providers>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
