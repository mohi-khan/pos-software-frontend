'use client'
import React, { useState } from 'react'
import {
  Download,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Store,
  Users,
  Filter,
  X,
} from 'lucide-react'

const InventoryHistory = () => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentMonth, setCurrentMonth] = useState(11) // December (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [startDate, setStartDate] = useState('12/02/2025')
  const [endDate, setEndDate] = useState('12/31/2025')
  const [selectedStartDay, setSelectedStartDay] = useState(2)
  const [selectedEndDay, setSelectedEndDay] = useState(31)
  const [selectedStartMonth, setSelectedStartMonth] = useState(11)
  const [selectedStartYear, setSelectedStartYear] = useState(2025)
  const [selectedEndMonth, setSelectedEndMonth] = useState(11)
  const [selectedEndYear, setSelectedEndYear] = useState(2025)
  const [selectedStore, setSelectedStore] = useState('All stores')
  const [selectedEmployee, setSelectedEmployee] = useState('All employees')
  const [selectedReason, setSelectedReason] = useState('All reasons')
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false)
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false)
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false)

  const inventoryData = [
    {
      date: 'Dec 31, 2025 12:55 PM',
      item: 'new items',
      store: 'bizflow',
      employee: 'Owner',
      reason: 'Transfer',
      adjustment: -2,
      stockAfter: 2,
    },
    {
      date: 'Dec 31, 2025 12:55 PM',
      item: 'fried rice',
      store: 'bizflow',
      employee: 'Owner',
      reason: 'Transfer',
      adjustment: -2,
      stockAfter: 33,
    },
    {
      date: 'Dec 30, 2025 04:56 PM',
      item: 'fried rice',
      store: 'bizflow',
      employee: 'Owner',
      reason: 'Inventory count',
      adjustment: -1,
      stockAfter: 35,
    },
    {
      date: 'Dec 30, 2025 03:23 PM',
      item: 'fried rice',
      store: 'bizflow',
      employee: 'Owner',
      reason: 'Production',
      adjustment: -4,
      stockAfter: 36,
    },
    {
      date: 'Dec 30, 2025 03:23 PM',
      item: 'new items',
      store: 'bizflow',
      employee: 'Owner',
      reason: 'Production',
      adjustment: 4,
      stockAfter: 4,
    },
    {
      date: 'Dec 30, 2025 03:03 PM',
      item: 'fried rice',
      store: 'New bizflow',
      employee: 'Owner',
      reason: 'Receive items',
      adjustment: 5,
      stockAfter: 15,
    },
    {
      date: 'Dec 30, 2025 11:30 AM',
      item: 'fried rice',
      store: 'New bizflow',
      employee: 'Owner',
      reason: 'Item edit',
      adjustment: 9,
      stockAfter: 10,
    },
    {
      date: 'Dec 30, 2025 11:29 AM',
      item: 'fried rice',
      store: 'New bizflow',
      employee: 'Manager',
      reason: 'Inventory count',
      adjustment: -10,
      stockAfter: 1,
    },
    {
      date: 'Dec 30, 2025 11:29 AM',
      item: 'fried rice',
      store: 'New bizflow',
      employee: 'Manager',
      reason: 'Receive items',
      adjustment: 1,
      stockAfter: 11,
    },
    {
      date: 'Dec 30, 2025 11:26 AM',
      item: 'fried rice',
      store: 'New bizflow',
      employee: 'Staff',
      reason: 'Item edit',
      adjustment: 10,
      stockAfter: 10,
    },
  ]

  const stores = ['All stores', 'bizflow', 'New bizflow']
  const employees = ['All employees', 'Owner', 'Manager', 'Staff']
  const reasons = [
    'All reasons',
    'Transfer',
    'Inventory count',
    'Production',
    'Receive items',
    'Item edit',
  ]

  const quickDates = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This week', value: 'week' },
    { label: 'Last week', value: 'lastweek' },
    { label: 'This month', value: 'month' },
    { label: 'Last month', value: 'lastmonth' },
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
  ]

  const handleQuickDate = (value: string) => {
    const today = new Date(2025, 11, 31) // Dec 31, 2025
    let start = new Date()
    let end = new Date()

    switch (value) {
      case 'today':
        start = end = today
        break
      case 'yesterday':
        start = end = new Date(2025, 11, 30)
        break
      case 'week':
        start = new Date(2025, 11, 25)
        end = today
        break
      case 'lastweek':
        start = new Date(2025, 11, 18)
        end = new Date(2025, 11, 24)
        break
      case 'month':
        start = new Date(2025, 11, 1)
        end = today
        break
      case 'lastmonth':
        start = new Date(2025, 10, 1)
        end = new Date(2025, 10, 30)
        break
      case '7days':
        start = new Date(2025, 11, 24)
        end = today
        break
      case '30days':
        start = new Date(2025, 11, 1)
        end = today
        break
    }

    setStartDate(
      `${start.getMonth() + 1}/${start.getDate()}/${start.getFullYear()}`
    )
    setEndDate(`${end.getMonth() + 1}/${end.getDate()}/${end.getFullYear()}`)
    setSelectedStartDay(start.getDate())
    setSelectedEndDay(end.getDate())
    setSelectedStartMonth(start.getMonth())
    setSelectedStartYear(start.getFullYear())
    setSelectedEndMonth(end.getMonth())
    setSelectedEndYear(end.getFullYear())
  }

  const handleDayClick = (day: number, month: number, year: number) => {
    // If both are selected, start fresh with new start date
    if (selectedStartDay && selectedEndDay) {
      setSelectedStartDay(day)
      setSelectedStartMonth(month)
      setSelectedStartYear(year)
      setSelectedEndDay(0)
      setStartDate(`${month + 1}/${day}/${year}`)
      return
    }

    // If only start is selected, set end date
    if (selectedStartDay && !selectedEndDay) {
      const startDateObj = new Date(
        selectedStartYear,
        selectedStartMonth,
        selectedStartDay
      )
      const endDateObj = new Date(year, month, day)

      if (endDateObj >= startDateObj) {
        setSelectedEndDay(day)
        setSelectedEndMonth(month)
        setSelectedEndYear(year)
        setEndDate(`${month + 1}/${day}/${year}`)
      } else {
        // If clicked date is before start, make it the new start
        setSelectedEndDay(selectedStartDay)
        setSelectedEndMonth(selectedStartMonth)
        setSelectedEndYear(selectedStartYear)
        setEndDate(
          `${selectedStartMonth + 1}/${selectedStartDay}/${selectedStartYear}`
        )
        setSelectedStartDay(day)
        setSelectedStartMonth(month)
        setSelectedStartYear(year)
        setStartDate(`${month + 1}/${day}/${year}`)
      }
      return
    }

    // If nothing selected, set start date
    setSelectedStartDay(day)
    setSelectedStartMonth(month)
    setSelectedStartYear(year)
    setSelectedEndDay(0)
    setStartDate(`${month + 1}/${day}/${year}`)
  }

  const isInRange = (day: number, month: number, year: number) => {
    if (!selectedStartDay || !selectedEndDay) return false

    const currentDate = new Date(year, month, day)
    const startDateObj = new Date(
      selectedStartYear,
      selectedStartMonth,
      selectedStartDay
    )
    const endDateObj = new Date(
      selectedEndYear,
      selectedEndMonth,
      selectedEndDay
    )

    return currentDate >= startDateObj && currentDate <= endDateObj
  }

  const isStartOrEnd = (day: number, month: number, year: number) => {
    const isStart =
      day === selectedStartDay &&
      month === selectedStartMonth &&
      year === selectedStartYear
    const isEnd =
      day === selectedEndDay &&
      month === selectedEndMonth &&
      year === selectedEndYear
    return isStart || isEnd
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear)

    const days = []

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        month: currentMonth === 0 ? 11 : currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        month: currentMonth,
        year: currentYear,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
      })
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const exportToExcel = () => {
    const csvContent = [
      [
        'Date',
        'Item',
        'Store',
        'Employee',
        'Reason',
        'Adjustment',
        'Stock After',
      ],
      ...inventoryData.map((row) => [
        row.date,
        row.item,
        row.store,
        row.employee,
        row.reason,
        row.adjustment,
        row.stockAfter,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory-history.csv'
    a.click()
  }

  const getReasonColor = (reason: string) => {
    const baseReason = reason.split(' #')[0] // Remove ID part
    if (baseReason.includes('Transfer')) return 'text-emerald-600'
    if (baseReason.includes('Inventory count')) return 'text-blue-600'
    if (baseReason.includes('Production')) return 'text-purple-600'
    if (baseReason.includes('Receive items')) return 'text-orange-600'
    return 'text-gray-600'
  }

  const filteredData = inventoryData.filter((row) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      row.item.toLowerCase().includes(searchLower) ||
      row.store.toLowerCase().includes(searchLower) ||
      row.reason.toLowerCase().includes(searchLower)

    const matchesStore =
      selectedStore === 'All stores' || row.store === selectedStore
    const matchesEmployee =
      selectedEmployee === 'All employees' || row.employee === selectedEmployee
    const matchesReason =
      selectedReason === 'All reasons' || row.reason.includes(selectedReason)

    return matchesSearch && matchesStore && matchesEmployee && matchesReason
  })

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return ''
    const [month, day, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Date Range and Filters */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              {/* <button 
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 relative"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Dec 2, 2025 - Dec 31, 2025</span>
              </button> */}
              <button
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 relative"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => {
                    setStoreDropdownOpen(!storeDropdownOpen)
                    setEmployeeDropdownOpen(false)
                    setReasonDropdownOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Store className="w-4 h-4" />
                  <span className="text-sm">{selectedStore}</span>
                </button>
                {storeDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg z-10 min-w-[160px]">
                    {stores.map((store) => (
                      <button
                        key={store}
                        onClick={() => {
                          setSelectedStore(store)
                          setStoreDropdownOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                          selectedStore === store
                            ? 'bg-gray-50 font-medium'
                            : ''
                        }`}
                      >
                        {store}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setEmployeeDropdownOpen(!employeeDropdownOpen)
                    setStoreDropdownOpen(false)
                    setReasonDropdownOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{selectedEmployee}</span>
                </button>
                {employeeDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg z-10 min-w-[160px]">
                    {employees.map((employee) => (
                      <button
                        key={employee}
                        onClick={() => {
                          setSelectedEmployee(employee)
                          setEmployeeDropdownOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                          selectedEmployee === employee
                            ? 'bg-gray-50 font-medium'
                            : ''
                        }`}
                      >
                        {employee}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setReasonDropdownOpen(!reasonDropdownOpen)
                    setStoreDropdownOpen(false)
                    setEmployeeDropdownOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">{selectedReason}</span>
                </button>
                {reasonDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg z-10 min-w-[160px]">
                    {reasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => {
                          setSelectedReason(reason)
                          setReasonDropdownOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                          selectedReason === reason
                            ? 'bg-gray-50 font-medium'
                            : ''
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date Picker Modal */}
        {datePickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {generateCalendarDays().map((dayObj, idx) => {
                    const isSelectedDate =
                      dayObj.isCurrentMonth &&
                      isStartOrEnd(dayObj.day, dayObj.month, dayObj.year)
                    const inRange =
                      dayObj.isCurrentMonth &&
                      isInRange(dayObj.day, dayObj.month, dayObj.year) &&
                      !isSelectedDate

                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          handleDayClick(dayObj.day, dayObj.month, dayObj.year)
                        }
                        className={`p-2 text-sm rounded-full transition-colors ${
                          isSelectedDate
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : inRange
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : dayObj.isCurrentMonth
                                ? 'hover:bg-gray-100'
                                : 'text-gray-400'
                        }`}
                      >
                        {dayObj.day}
                      </button>
                    )
                  })}
                </div>

                {/* Quick Date Options */}
                <div className="border-t pt-3 mb-4 max-h-48 overflow-y-auto">
                  {quickDates.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuickDate(option.value)}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Start date
                    </label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      End date
                    </label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDatePickerOpen(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => setDatePickerOpen(false)}
                    className="px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600 rounded"
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export and Search Bar */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 text-sm font-medium hover:text-green-600"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">EXPORT</span>
            </button>

            <div className="flex-1 flex justify-end">
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  <Search size={18} className="text-gray-600 mx-auto" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-48"
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowSearch(false)
                      setSearchTerm('')
                    }}
                    className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                  >
                    <X size={18} className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table for Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className=" min-w-max table-fixed">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 w-48">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 w-32">
                    Item
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 w-32">
                    Store
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 w-32">
                    Employee
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 w-56">
                    Reason
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-600 w-28">
                    Adjustment
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-600 w-28">
                    Stock after
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 truncate">
                      {row.item}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 truncate">
                      {row.store}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 truncate">
                      {row.employee}
                    </td>
                    <td className="px-6 py-4 text-sm truncate">
                      <span className={getReasonColor(row.reason)}>
                        {row.reason}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-right whitespace-nowrap ${row.adjustment > 0 ? 'text-green-600' : 'text-gray-900'}`}
                    >
                      {row.adjustment}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                      {row.stockAfter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded disabled:opacity-50">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>Page:</span>
              <input
                type="text"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                className="w-12 px-2 py-1 border rounded text-center"
              />
              <span>of 2</span>
              <span className="ml-4">Rows per page:</span>
              <select className="px-2 py-1 border rounded">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards for Mobile */}
        <div className="md:hidden space-y-3">
          {filteredData.map((row, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-gray-900">{row.item}</div>
                  <div className="text-xs text-gray-500">{row.date}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium ${row.adjustment > 0 ? 'text-green-600' : 'text-gray-900'}`}
                  >
                    {row.adjustment > 0 ? '+' : ''}
                    {row.adjustment}
                  </div>
                  <div className="text-xs text-gray-500">
                    Stock: {row.stockAfter}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Store:</span>
                  <span className="text-gray-900">{row.store}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee:</span>
                  <span className="text-gray-900">{row.employee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reason:</span>
                  <span className={getReasonColor(row.reason)}>
                    {row.reason}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Pagination */}
          <div className="flex items-center justify-center gap-4 py-4">
            <button className="p-2 hover:bg-gray-100 rounded disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm">Page 1 of 2</span>
            <button className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryHistory
