import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { Audio } from 'react-loader-spinner'
import { useEffect, useState } from 'react'

export const AddressDetail = () => {
  const [addess, setAddress] = useState([])
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [formData, setFormData] = useState({
    addressName: '',
    address: '',
    ward: '',
    province: ''
  })
  
  const tokenUser = localStorage.getItem('token')
  const navigate = useNavigate()
  const { id } = useParams()

  const callAddress = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/admin/user-address/user/${id}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setAddress(sortedData)
        if (sortedData.length > 0) {
          setUserInfo(sortedData[0])
        }
        
        setLoading(false)
      }
    } catch (error) {
      console.log("Lỗi nè:", error)
      setLoading(false)
    }
  }
console.log(userInfo)
  const handleEdit = (address) => {
    setEditingItem(address)
    setFormData({
      addressName: address.addressName || '',
      address: address.address || '',
      ward: address.ward || '',
      province: address.province || ''
    })
    setShowEditDialog(true)
    setActiveDropdown(null)
  }

  const handleDelete = async (addressId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        const res = await axios.delete(`${BaseUrl}/admin/user-address/${addressId}`, {
          headers: { Authorization: `Bearer ${tokenUser}` }
        });
        if (res.status === 200) {
          alert('Xóa địa chỉ thành công!')
          callAddress() // Refresh data
        }
      } catch (error) {
        console.log("Lỗi khi xóa:", error)
        alert('Có lỗi xảy ra khi xóa địa chỉ!')
      }
    }
    setActiveDropdown(null)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`${BaseUrl}/admin/user-address/${editingItem._id}`, formData, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        alert('Cập nhật địa chỉ thành công!')
        setShowEditDialog(false)
        callAddress() // Refresh data
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật:", error)
      alert('Có lỗi xảy ra khi cập nhật địa chỉ!')
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const toggleDropdown = (addressId) => {
    setActiveDropdown(activeDropdown === addressId ? null : addressId)
  }

  useEffect(() => {
    callAddress()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Audio color="#4fa94d" height={80} width={80} />
      </div>
    )
  }

  return (
    <div className="p-6">
      {addess.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có địa chỉ nào</h3>
            <p>Người dùng này chưa có địa chỉ nào được lưu.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {addess.map((address, index) => (
            <div key={address._id} className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {address.addressName}
                      </h3>
                      {index === 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Mới nhất
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex">
                        <span className="font-medium w-20">Địa chỉ:</span>
                        <span>{address.address}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Phường/Xã:</span>
                        <span>{address.ward}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Tỉnh/TP:</span>
                        <span>{address.province}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Ngày tạo:</span>
                        <span>
                          {new Date(address.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Dropdown */}
                  <div className="relative ml-4">
                    <button
                      onClick={() => toggleDropdown(address._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    
                    {activeDropdown === address._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleEdit(address)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Sửa địa chỉ
                          </button>
                          <button
                            onClick={() => handleDelete(address._id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa địa chỉ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sửa địa chỉ</h3>
              <button
                onClick={() => setShowEditDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên địa chỉ
                </label>
                <input
                  type="text"
                  name="addressName"
                  value={formData.addressName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phường/Xã
                </label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỉnh/Thành phố
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressDetail