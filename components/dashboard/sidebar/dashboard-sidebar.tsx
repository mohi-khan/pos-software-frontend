'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronDown,
  Home,
  Package,
  Users,
  Menu,
  X,
  User2,
  LogOut,
  KeyRound,
  ShoppingBag,
  SettingsIcon,
} from 'lucide-react'
import { useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { se } from 'date-fns/locale'

export function DashboardSidebar() {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const pathname = usePathname()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
  const userMenuRef = useRef<HTMLDivElement>(null)

  console.log('show all user data after login : ', userData?.userId)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard/dashboard-overview',
    },
    {
      title: 'Items',
      icon: Package,
      href: '/dashboard/setup',
      subItems: [
        {
          title: 'Item list',
          href: '/items/items-list',
        },
        {
          title: 'Categories',
          href: '/items/categories',
        },
      ],
    },

    {
      title: 'Customers',
      icon: Users,
      href: '/dashboard/customers',
      subItems: [
        {
          title: 'Customers',
          href: '/customers/customers',
        },
      ],
    },

    {
      title: 'Inventory Management',
      icon: ShoppingBag,
      href: '/dashboard/customers',
      subItems: [
        {
          title: 'Purchase Orders',
          href: '/Inventory_management/purchase-orders',
        },
        {
          title: 'Transfer Orders',
          href: '/Inventory_management/transfer-orders',
        },
        {
          title: 'Stock Adjustment',
          href: '/Inventory_management/stock-adjustment',
        },
        {
          title: 'Productions',
          href: '/Inventory_management/productions',
        },
        {
          title: 'Suplier',
          href: '/Inventory_management/suplier',
        },
        {
          title: 'Inventory History',
          href: '/Inventory_management/inventory-history',
        },
      ],
    },
    {
      title: 'Store & POS settings',
      icon: SettingsIcon,
      href: '/dashboard/customers',
      subItems: [
        {
          title: 'POS Devices',
          href: '/pos-settings/pos-device',
        },
        {
          title: 'POS Stores',
          href: '/pos-settings/pos-stores',
        },
      ],
    },
  ]

  const isSubItemActive = (item: any) => {
    if (!item.subItems) return false
    return item.subItems.some((subItem: any) => pathname === subItem.href)
  }

  const isItemActive = (item: any) => {
    return (
      pathname === item.href ||
      pathname.startsWith(item.href) ||
      isSubItemActive(item)
    )
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }

  const toggleSubmenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleSignOut = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
    setIsUserMenuOpen(false)
    router.push('/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          transition-all duration-300 border-r border-gray-200 bg-white
          flex flex-col h-screen
          ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile && (isExpanded ? 'w-64' : 'w-20')}
          ${isMobile ? 'w-64' : ''}
        `}
      >
        {/* Header */}
        <div className="bg-green-600 h-16 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() =>
                isMobile ? setIsMobileOpen(false) : setIsExpanded(!isExpanded)
              }
              className="p-1.5 hover:bg-green-700 rounded text-white transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {isMobile ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1
              className={`text-white font-semibold text-lg transition-all duration-300 whitespace-nowrap ${
                isMobile || isExpanded
                  ? 'opacity-100'
                  : 'opacity-0 w-0 overflow-hidden'
              }`}
            >
              Dashboard
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="py-4 overflow-y-auto flex-1">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <div key={item.title}>
                {!item.subItems ? (
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center w-full py-3 px-3 rounded-lg transition-all duration-200
                      ${isMobile || isExpanded ? 'justify-start' : 'justify-center'}
                      ${
                        isItemActive(item)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${isMobile || isExpanded ? 'mr-3' : ''}`}
                    />
                    {(isMobile || isExpanded) && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`
                        flex items-center w-full py-3 px-3 rounded-lg transition-all duration-200
                        ${isMobile || isExpanded ? 'justify-start' : 'justify-center'}
                        ${
                          isItemActive(item)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon
                        className={`w-5 h-5 flex-shrink-0 ${isMobile || isExpanded ? 'mr-3' : ''}`}
                      />
                      {(isMobile || isExpanded) && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">
                            {item.title}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                              openMenus[item.title] ? 'rotate-180' : ''
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {(isMobile || isExpanded) && openMenus[item.title] && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            onClick={handleLinkClick}
                            className={`
                              block px-3 py-2 rounded-lg text-sm transition-colors
                              ${
                                pathname === subItem.href
                                  ? 'bg-gray-100 text-gray-900 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer - User Menu */}
        {/* <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors
                ${isMobile || isExpanded ? 'justify-start' : 'justify-center'}
              `}
            >
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User2 className="w-5 h-5 text-gray-600" />
              </div>
              {(isMobile || isExpanded) && (
                <div className="flex-1 text-left">
                 {userData?.username && (
              <p className="text-xl text-gray-700 font-bold ring-1 ring-black rounded-lg px-2 py-1  text-center">
                {userData.username.replace(/\b\w/g, (c:any) => c.toUpperCase())}
              </p>
            )}
                  
                </div>
              )}
            </button>

           
            {isUserMenuOpen && (
              <div
                className={`
                absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden
                ${isMobile || isExpanded ? 'left-0 right-0' : 'left-0 w-48'}
              `}
              >
                <Link
                  href="/change-password"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    handleLinkClick()
                  }}
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="text-sm">Change Password</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div> */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`
        w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors
        ${isMobile || isExpanded ? 'justify-start' : 'justify-center'}
      `}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {userData?.username ? (
                  userData.username
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                ) : (
                  <User2 className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Username & optional role/email */}
              {(isMobile || isExpanded) && userData?.username && (
                <div className="flex-1 flex flex-col justify-center text-left overflow-hidden">
                  <span className="text-gray-900 font-semibold text-base truncate">
                    {userData.username.replace(/\b\w/g, (c: any) =>
                      c.toUpperCase()
                    )}
                  </span>
                  {userData.email && (
                    <span className="text-gray-500 text-sm truncate">
                      {userData.email}
                    </span>
                  )}
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className={`
          absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden
          ${isMobile || isExpanded ? 'left-0 right-0' : 'left-0 w-48'}
        `}
              >
                <Link
                  href="/change-password"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    handleLinkClick()
                  }}
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="text-sm">Change Password</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// 'use client'

// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// import {
//   ChevronDown,
//   Home,
//   Settings,
//   Users,
//   Menu,
//   X,
// } from 'lucide-react'

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from '@/components/ui/collapsible'
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
//   SidebarRail,
// } from '@/components/ui/sidebar'

// export function DashboardSidebar() {
//   const pathname = usePathname()
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [isMobileOpen, setIsMobileOpen] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//       if (window.innerWidth >= 768) {
//         setIsMobileOpen(false)
//       }
//     }

//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   const navItems = [
//     {
//       title: 'Dashboard Overview',
//       icon: Home,
//       href: '/dashboard/dashboard-overview',
//     },
//     {
//       title: 'Items',
//       icon: Settings,
//       href: '/dashboard/setup',
//       subItems: [
//         {
//           title: 'Item list',
//           href: '/items/items-list',
//         },
//         {
//           title: 'Categories',
//           href: '/items/categories',
//         },
//       ],
//     },
//     {
//       title: 'Customers',
//       icon: Users,
//       href: '/dashboard/customers',
//       subItems: [
//         {
//           title: 'Customer base',
//           href: '/customers/customer-base',
//         },
//       ],
//     },
//   ]

//   const isSubItemActive = (item: any) => {
//     if (!item.subItems) return false
//     return item.subItems.some((subItem: any) => pathname === subItem.href)
//   }

//   const isItemActive = (item: any) => {
//     return pathname.startsWith(item.href) || isSubItemActive(item)
//   }

//   const handleLinkClick = () => {
//     if (isMobile) {
//       setIsMobileOpen(false)
//     }
//   }

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       {isMobile && (
//         <button
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//           className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg hover:bg-gray-100 md:hidden"
//           aria-label="Toggle menu"
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//       )}

//       {/* Mobile Overlay */}
//       {isMobile && isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <Sidebar
//         className={`
//           transition-all duration-300
//           ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
//           ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}
//           ${!isMobile && (isExpanded ? 'w-64' : 'w-16')}
//           ${isMobile ? 'w-64' : ''}
//         `}
//       >
//         <SidebarHeader className="border-b mt-16 flex items-center justify-between px-2">
//           <h1
//             className={`text-base font-bold transition-all duration-300 ${
//               (isMobile || isExpanded) ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
//             }`}
//           >
//             Dashboard
//           </h1>

//           {isMobile ? (
//             <button
//               onClick={() => setIsMobileOpen(false)}
//               className="p-2 hover:bg-gray-100 rounded-md md:hidden"
//               aria-label="Close menu"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           ) : (
//             <button
//               onClick={() => setIsExpanded(!isExpanded)}
//               className="p-2 hover:bg-gray-100 rounded-md hidden md:block"
//               aria-label="Toggle sidebar"
//             >
//               <Menu className="w-5 h-5" />
//             </button>
//           )}
//         </SidebarHeader>

//         <SidebarContent>
//           <SidebarGroup>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {navItems.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     {!item.subItems ? (
//                       <SidebarMenuButton
//                         asChild
//                         className={`${
//                           isItemActive(item)
//                             ? 'bg-yellow-400 text-black hover:bg-yellow-400'
//                             : ''
//                         } ${(isMobile || isExpanded) ? 'justify-start' : 'justify-center'}`}
//                         tooltip={(!isMobile && !isExpanded) ? item.title : undefined}
//                       >
//                         <Link href={item.href} onClick={handleLinkClick}>
//                           <item.icon className={`w-5 h-5 ${(isMobile || isExpanded) ? 'mr-2' : ''}`} />
//                           {(isMobile || isExpanded) && <span>{item.title}</span>}
//                         </Link>
//                       </SidebarMenuButton>
//                     ) : (
//                       <Collapsible
//                         defaultOpen={isItemActive(item)}
//                         className="w-full"
//                       >
//                         <CollapsibleTrigger className="w-full" asChild>
//                           <SidebarMenuButton
//                             className={`${
//                               isItemActive(item)
//                                 ? 'bg-yellow-400 text-black hover:bg-yellow-400'
//                                 : ''
//                             } ${(isMobile || isExpanded) ? 'justify-start' : 'justify-center'}`}
//                             tooltip={(!isMobile && !isExpanded) ? item.title : undefined}
//                           >
//                             <item.icon className={`w-5 h-5 ${(isMobile || isExpanded) ? 'mr-2' : ''}`} />
//                             {(isMobile || isExpanded) && (
//                               <>
//                                 <span>{item.title}</span>
//                                 <ChevronDown className="ml-auto w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
//                               </>
//                             )}
//                           </SidebarMenuButton>
//                         </CollapsibleTrigger>
//                         {(isMobile || isExpanded) && (
//                           <CollapsibleContent>
//                             <SidebarMenuSub>
//                               {item.subItems.map((subItem) => (
//                                 <SidebarMenuSubItem key={subItem.title}>
//                                   <SidebarMenuSubButton
//                                     asChild
//                                     className={`${
//                                       pathname === subItem.href
//                                         ? 'bg-gray-100 text-black'
//                                         : ''
//                                     }`}
//                                   >
//                                     <Link
//                                       className="h-auto mt-2"
//                                       href={subItem.href}
//                                       onClick={handleLinkClick}
//                                     >
//                                       {subItem.title}
//                                     </Link>
//                                   </SidebarMenuSubButton>
//                                 </SidebarMenuSubItem>
//                               ))}
//                             </SidebarMenuSub>
//                           </CollapsibleContent>
//                         )}
//                       </Collapsible>
//                     )}
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//         <SidebarRail />
//       </Sidebar>
//     </>
//   )
// }

// // 'use client'

// // import { usePathname } from 'next/navigation'
// // import Link from 'next/link'
// // import {
// //   BriefcaseBusiness,
// //   ChevronDown,
// //   FileChartColumn,
// //   Home,
// //   NotebookText,
// //   Settings,
// //   SquarePlus,
// //   UserCog,
// //   Users,
// // } from 'lucide-react'

// // import {
// //   Collapsible,
// //   CollapsibleContent,
// //   CollapsibleTrigger,
// // } from '@/components/ui/collapsible'
// // import {
// //   Sidebar,
// //   SidebarContent,
// //   SidebarGroup,
// //   SidebarGroupContent,
// //   SidebarHeader,
// //   SidebarMenu,
// //   SidebarMenuButton,
// //   SidebarMenuItem,
// //   SidebarMenuSub,
// //   SidebarMenuSubButton,
// //   SidebarMenuSubItem,
// //   SidebarRail,
// // } from '@/components/ui/sidebar'

// // export function DashboardSidebar() {
// //   const pathname = usePathname()

// //   const navItems = [
// //     {
// //       title: 'Dashboard Overview',
// //       icon: Home,
// //       href: '/dashboard/dashboard-overview',
// //     },
// //     {
// //       title: 'Items',
// //       icon: Settings,
// //       href: '/dashboard/setup',
// //       subItems: [
// //         {
// //           title: 'Item list',
// //           href: '/items/items-list',
// //         },
// //         {
// //           title: 'Categories',
// //           href: '/items/categories',
// //         },
// //       ],
// //     },
// //     {
// //       title: 'Customers',
// //       icon: Users,
// //       href: '/dashboard/setup',
// //       subItems: [
// //         // {
// //         //   title: 'Item list',
// //         //   href: '/items/items-list',
// //         // },
// //         // {
// //         //   title: 'Categories',
// //         //   href: '/items/categories',
// //         // },
// //       ],
// //     },
// //   ]

// //   // Check if the current path is in the submenu items
// //   const isSubItemActive = (item: any) => {
// //     if (!item.subItems) return false
// //     return item.subItems.some((subItem: any) => pathname === subItem.href)
// //   }

// //   // Check if the current path matches the main item or its sub-items
// //   const isItemActive = (item: any) => {
// //     return pathname.startsWith(item.href) || isSubItemActive(item)
// //   }

// //   return (
// //     <Sidebar>
// //       <SidebarHeader className="border-b mt-16">
// //         <div className="p-2">
// //           <h1 className="text-xl font-bold">My Dashboard</h1>
// //         </div>
// //       </SidebarHeader>
// //       <SidebarContent>
// //         <SidebarGroup>
// //           <SidebarGroupContent>
// //             <SidebarMenu>
// //               {navItems.map((item) => (
// //                 <SidebarMenuItem key={item.title}>
// //                   {!item.subItems ? (
// //                     // Regular menu item without submenu
// //                     <SidebarMenuButton
// //                       asChild
// //                       className={`${isItemActive(item) ? 'bg-yellow-400 text-black hover:bg-yellow-400' : ''}  `}
// //                     >
// //                       <Link href={item.href}>
// //                         <item.icon className="mr-2 w-4" />
// //                         <span>{item.title}</span>
// //                       </Link>
// //                     </SidebarMenuButton>
// //                   ) : (
// //                     // Menu item with submenu as accordion
// //                     <Collapsible
// //                       defaultOpen={isItemActive(item)}
// //                       className="w-full"
// //                     >
// //                       <CollapsibleTrigger className="w-full" asChild>
// //                         <SidebarMenuButton
// //                           className={`${isItemActive(item) ? 'bg-yellow-400 text-black hover:bg-yellow-400' : ''}  `}
// //                         >
// //                           <item.icon className="mr-2 w-4" />
// //                           <span>{item.title}</span>
// //                           <ChevronDown className="ml-auto w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
// //                         </SidebarMenuButton>
// //                       </CollapsibleTrigger>
// //                       <CollapsibleContent>
// //                         <SidebarMenuSub>
// //                           {item.subItems.map((subItem) => (
// //                             <SidebarMenuSubItem key={subItem.title}>
// //                               <SidebarMenuSubButton
// //                                 asChild
// //                                 className={`${pathname === subItem.href ? 'bg-gray-100 text-black' : ''}`}
// //                               >
// //                                 <Link
// //                                   className="h-auto mt-2"
// //                                   href={subItem.href}
// //                                 >
// //                                   {subItem.title}
// //                                 </Link>
// //                               </SidebarMenuSubButton>
// //                             </SidebarMenuSubItem>
// //                           ))}
// //                         </SidebarMenuSub>
// //                       </CollapsibleContent>
// //                     </Collapsible>
// //                   )}
// //                 </SidebarMenuItem>
// //               ))}
// //             </SidebarMenu>
// //           </SidebarGroupContent>
// //         </SidebarGroup>
// //       </SidebarContent>
// //       <SidebarRail />
// //     </Sidebar>
// //   )
// // }
