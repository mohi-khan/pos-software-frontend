'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react'

const InventoryValuation = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedStore, setSelectedStore] = useState('All stores')
  const [selectedCategory, setSelectedCategory] = useState('All categories')
  const [tempDate, setTempDate] = useState(new Date(2026, 0, 1))

  const inventoryData = [
    {
      item: 'fried rice',
      inStock: 48,
      cost: 837.45,
      inventoryValue: 40197.6,
      retailValue: 48000.0,
      potentialProfit: 7802.4,
      margin: 16.25,
    },
    {
      item: 'new items',
      inStock: 2,
      cost: 837.45,
      inventoryValue: 1674.9,
      retailValue: 2000.0,
      potentialProfit: 325.1,
      margin: 16.25,
    },
  ]

  const totalInventoryValue = inventoryData.reduce(
    (sum, item) => sum + item.inventoryValue,
    0
  )
  const totalRetailValue = inventoryData.reduce(
    (sum, item) => sum + item.retailValue,
    0
  )
  const totalPotentialProfit = inventoryData.reduce(
    (sum, item) => sum + item.potentialProfit,
    0
  )
  const totalMargin = (totalPotentialProfit / totalRetailValue) * 100

  // Calendar functions
  const formatDate = (date: Date): string => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const handlePrevDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
    setTempDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
    setTempDate(newDate)
  }

  interface DaysInMonthResult {
    daysInMonth: number
    startingDayOfWeek: number
    year: number
    month: number
  }

  const getDaysInMonth = (date: Date): DaysInMonthResult => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const handleDateClick = (day: number): void => {
    const newDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), day)
    setTempDate(newDate)
  }

  const handleCalendarPrev = () => {
    const newDate = new Date(tempDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setTempDate(newDate)
  }

  const handleCalendarNext = () => {
    const newDate = new Date(tempDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setTempDate(newDate)
  }

  const handleDone = () => {
    setCurrentDate(tempDate)
    setShowCalendar(false)
  }

  const handleCancel = () => {
    setTempDate(currentDate)
    setShowCalendar(false)
  }

  const exportToExcel = () => {
    const headers = [
      'Item',
      'In Stock',
      'Cost',
      'Inventory Value',
      'Retail Value',
      'Potential Profit',
      'Margin',
    ]

    let csvContent = headers.join(',') + '\n'

    inventoryData.forEach((item) => {
      const row = [
        item.item,
        item.inStock,
        item.cost.toFixed(2),
        item.inventoryValue.toFixed(2),
        item.retailValue.toFixed(2),
        item.potentialProfit.toFixed(2),
        item.margin.toFixed(2) + '%',
      ]
      csvContent += row.join(',') + '\n'
    })

    csvContent += '\nSummary\n'
    csvContent += `Total Inventory Value,${totalInventoryValue.toFixed(2)}\n`
    csvContent += `Total Retail Value,${totalRetailValue.toFixed(2)}\n`
    csvContent += `Total Potential Profit,${totalPotentialProfit.toFixed(2)}\n`
    csvContent += `Total Margin,${totalMargin.toFixed(2)}%\n`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `inventory_valuation_${formatDate(currentDate).replace(/ /g, '_')}.csv`
    )
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(tempDate)
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

    const days = []
    const prevMonthDays = new Date(year, month, 0).getDate()

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          className="p-2 text-gray-400 hover:bg-gray-100 rounded"
          disabled
        >
          {prevMonthDays - i}
        </button>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === tempDate.getDate()
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 rounded hover:bg-gray-100 ${
            isSelected
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'text-gray-700'
          }`}
        >
          {day.toString().padStart(2, '0')}
        </button>
      )
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <button
          key={`next-${day}`}
          className="p-2 text-gray-400 hover:bg-gray-100 rounded"
          disabled
        >
          {day.toString().padStart(2, '0')}
        </button>
      )
    }

    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50 w-80">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleCalendarPrev}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="font-medium text-gray-900">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleCalendarNext}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 p-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">{days}</div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="text-sm text-gray-600 mb-1">Date</div>
          <div className="font-medium text-gray-900">
            {tempDate.getMonth() + 1}/{tempDate.getDate()}/
            {tempDate.getFullYear()}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded"
          >
            CANCEL
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 text-green-600 font-medium hover:bg-green-50 rounded"
          >
            DONE
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
            <button onClick={handlePrevDay} className="p-3 hover:bg-gray-50">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
            >
              <Calendar size={18} className="text-gray-600" />
              <span className="text-gray-700 font-medium">
                {formatDate(currentDate)}
              </span>
            </button>
            <button onClick={handleNextDay} className="p-3 hover:bg-gray-50">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          {showCalendar && renderCalendar()}
        </div>

        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All stores</option>
          <option>Store 1</option>
          <option>Store 2</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All categories</option>
          <option>Food</option>
          <option>Beverages</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow
        "> */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-shadow duration-300">
          <div className="text-sm text-gray-600 mb-2">
            Total inventory value
          </div>
          <div className="text-3xl font-semibold text-gray-900">
            Tk
            {totalInventoryValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

       <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-shadow duration-300">
          <div className="text-sm text-gray-600 mb-2">Total retail value</div>
          <div className="text-3xl font-semibold text-gray-900">
            Tk
            {totalRetailValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-shadow duration-300">
          <div className="text-sm text-gray-600 mb-2">Potential profit</div>
          <div className="text-3xl font-semibold text-gray-900">
            Tk
            {totalPotentialProfit.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

       <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-shadow duration-300">
          <div className="text-sm text-gray-600 mb-2">Margin</div>
          <div className="text-3xl font-semibold text-gray-900">
            {totalMargin.toFixed(2)}%
          </div>
        </div>
      </div>

   <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl transition-shadow duration-300">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
       
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export to Excel</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Item
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  In stock
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Cost
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Inventory value
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Retail value
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Potential profit
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-900">{item.item}</td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {item.inStock}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    Tk{item.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    Tk
                    {item.inventoryValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    Tk
                    {item.retailValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    Tk
                    {item.potentialProfit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {item.margin.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {inventoryData.map((item, index) => (
            <div key={index} className="p-4 border-b border-gray-200">
              <div className="font-medium text-gray-900 mb-3">{item.item}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-600">In stock</div>
                  <div className="text-gray-900 font-medium">
                    {item.inStock}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Cost</div>
                  <div className="text-gray-900 font-medium">
                    Tk{item.cost.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Inventory value</div>
                  <div className="text-gray-900 font-medium">
                    Tk
                    {item.inventoryValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Retail value</div>
                  <div className="text-gray-900 font-medium">
                    Tk
                    {item.retailValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Potential profit</div>
                  <div className="text-gray-900 font-medium">
                    Tk
                    {item.potentialProfit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Margin</div>
                  <div className="text-gray-900 font-medium">
                    {item.margin.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-700">
            <span>
              Page: <span className="font-medium">1</span> of{' '}
              <span className="font-medium">1</span>
            </span>
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryValuation
