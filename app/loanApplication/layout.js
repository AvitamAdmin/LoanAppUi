"use client"
import React, { useState } from 'react';
import { Inter } from "next/font/google";
import Header from '../src/Header/header';
import Sidebar from '../sidenav/sidebar';
import ResSidebar from '../sidenav/ressidebar';
import "tailwind-scrollbar"


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, showHeader = true, showBreadcrumbs = true }) {

  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
      <div className={inter.className}>
        <div className='flex flex-col max-w-[100%] '>
          <ResSidebar />
          <div className='flex flex-row max-w-[100%]'>
            {/* Pass authtoken as a prop */}
            <Sidebar setSidebarVisible={setSidebarVisible}/>
            <div   className={`flex flex-col ${
              sidebarVisible ? "min-w-[84%] w-[84%]" : "w-[95%]"
            } max-h-screen scrollbar-none overflow-y-scroll transition-all duration-300`}
          >
              {/* <div className='p-2 '>
                {showHeader && <Header />}
              </div> */}
              <div className='max-w-full '>{children}</div>
            </div>
          </div>
        </div>
      </div>
  );
}
