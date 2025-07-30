import React from 'react'
import { BaseUrl } from '@/ipconfig'
import axios from 'axios'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Audio } from 'react-loader-spinner'
import { Typography } from '@material-tailwind/react'
import UserAddressDialog from './UserAddressDialog'

export const Address = () => {
  const [address,setAddress]=useState([])
  const [loading,setLoading]=useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [addressCount, setAddressCount] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProvince, setFilterProvince] = useState('')
  const [filteredAddresses, setFilteredAddresses] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [provinceInput, setProvinceInput] = useState('')
  const [formData, setFormData] = useState({
    addressName: '',
    address: '',
    ward: '',
    province: '',
    userId: ''
  })
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const navigate=useNavigate()
  const tokenUser = localStorage.getItem('token')

  const callAddress= async()=>{
    try {
      const res = await axios.get(`${BaseUrl}/admin/user-address`, {
          headers: { Authorization: `Bearer ${tokenUser}` }
        });
  if(res.status===200){
    const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    const groupedByUser = {}
    const countByUser = {}
    
    sortedData.forEach(address => {
      const userId = address.userId?.id 
      if (userId) {
        countByUser[userId] = (countByUser[userId] || 0) + 1
                if (!groupedByUser[userId]) {
          groupedByUser[userId] = address
        }
      }
    })
        const uniqueUserAddresses = Object.values(groupedByUser)
    
    setAddress(uniqueUserAddresses)
    setAddressCount(countByUser)
    setLoading(false)
  }

    } catch (error) {
      console.log("Lỗi nè:",error)
    }
  }
useEffect(()=>{
  callAddress()
},[])

  // Chỉ lọc khi nhấn nút tìm kiếm hoặc chọn tỉnh/thành phố
  const handleSearch = () => {
    setSearchTerm(searchInput)
    setFilterProvince(provinceInput)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
  }



  useEffect(() => {
    let filtered = address;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const userName = item.userId?.fullName?.toLowerCase() || '';
        const userEmail = item.userId?.email?.toLowerCase() || '';
        const addr = item.address?.toLowerCase() || '';
        const ward = item.ward?.toLowerCase() || '';
        const province = item.province?.toLowerCase() || '';
        return (
          userName.includes(search) ||
          userEmail.includes(search) ||
          addr.includes(search) ||
          ward.includes(search) ||
          province.includes(search)
        );
      });
    }
    if (filterProvince) {
      filtered = filtered.filter(item => item.province === filterProvince);
    }
    setFilteredAddresses(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterProvince, address])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAddresses.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [address.length])

  const provinces = [
    "Tuyên Quang", "Lào Cai", "Thái Nguyên", "Phú Thọ", "Bắc Ninh",
    "Hưng Yên", "Hải Phòng", "Ninh Bình", "Quảng Trị", "Đà Nẵng",
    "Quảng Ngãi", "Gia Lai", "Khánh Hòa", "Lâm Đồng", "Đắk Lắk",
    "Thành phố Hồ Chí Minh", "Đồng Nai", "Vĩnh Long", "Đồng Tháp", "Cà Mau", "An Giang",
    "Cần Thơ"
  ];

  const handleViewAddresses = (user) => {
    setSelectedUser(user)
    setShowAddressDialog(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" color="blue-gray" className="font-semibold">
          Quản lý Địa chỉ
        </Typography>
      </div>
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm (tên, email, địa chỉ, phường/xã, tỉnh/thành phố)
            </label>
            <div className="relative flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tìm kiếm
              </button>
            
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lọc theo tỉnh/thành phố
            </label>
            <div className="relative flex gap-2">
              <select
                value={provinceInput}
                onChange={e => setProvinceInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Lọc
              </button>
             
            </div>
          </div>
        </div>

        {searchTerm && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Tìm kiếm:</span> "{searchTerm}" - 
                <span className="font-medium"> {filteredAddresses.length} kết quả</span>
              </p>
              <button
                onClick={handleClearSearch}
                className="text-blue-700 hover:text-blue-900 text-sm font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Audio color="#4fa94d" height={80} width={80} />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ 
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phường/Xã
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỉnh/Thành phố
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo gần nhất
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng số địa chỉ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.userId?.id || item.userId?._id || item._id} className="hover:bg-gray-50 transition-colors cursor-pointer" 
                onClick={(e)=>{
                  handleViewAddresses(item)
                  e.stopPropagation()
                }}
                >
                  <td className="px-6 py-4 whitespace-nowrap" >
                    <div className="text-sm font-medium text-gray-900">
                      {item.userId?.fullName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.userId?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {item.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.ward}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.province}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {addressCount[item.userId?.id || item.userId?._id || item.userId] || 0} địa chỉ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAddresses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm ? `Không tìm thấy người dùng nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu địa chỉ'}
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredAddresses.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3">
              <nav className="flex items-center space-x-1">
                {/* Previous button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  const isCurrentPage = pageNumber === currentPage
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`flex items-center justify-center w-8 h-8 text-sm border rounded ${
                        isCurrentPage
                          ? 'bg-black text-white border-black'
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                {/* Ellipsis if needed */}
                {totalPages > 10 && (
                  <span className="flex items-center justify-center w-8 h-8 text-gray-500">
                    ...
                  </span>
                )}

                {/* Next button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      <UserAddressDialog
        open={showAddressDialog}
        onClose={() => setShowAddressDialog(false)}
        userId={selectedUser?.userId?.id}
        userName={selectedUser?.userId?.fullName}
      />
    </div>
  )
}

export default Address