import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { Audio } from 'react-loader-spinner'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography
} from '@material-tailwind/react'

export const UserAddressDialog = ({ open, onClose, userId, userName }) => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
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

  const callAddress = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const res = await axios.get(`${BaseUrl}/admin/user-address/user/${userId}`, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });
      if (res.status === 200) {
        const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setAddresses(sortedData)
      }
    } catch (error) {
      console.log("Lỗi:", error)
    } finally {
      setLoading(false)
    }
  }

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
          callAddress()
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa địa chỉ!')
      }
    }
    setActiveDropdown(null)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    
   
    
    try {
      const res = await axios.put(`${BaseUrl}/admin/user-address/${editingItem._id}`, formData, {
        headers: { 
          Authorization: `Bearer ${tokenUser}`,
          'Content-Type': 'application/json'
        }
      });
      
      
      if (res.status === 200) {
        alert('Cập nhật địa chỉ thành công!')
        setShowEditDialog(false)
        setEditingItem(null)
        setFormData({
          addressName: '',
          address: '',
          ward: '',
          province: ''
        })
        callAddress()
      }
    } catch (error) {
      alert(`Có lỗi xảy ra khi cập nhật địa chỉ: ${error.response?.data?.message || error.message}`)
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
    if (open && userId) {
      callAddress()
    }
  }, [open, userId])

  const handleClose = () => {
    setAddresses([])
    setActiveDropdown(null)
    setShowEditDialog(false)
    setEditingItem(null)
    setFormData({
      addressName: '',
      address: '',
      ward: '',
      province: ''
    })
    onClose()
  }

  return (
    <>
      <Dialog open={open} handler={() => {}} size="lg">
        <DialogHeader className="flex justify-between items-center">
          <Typography variant="h5">
            Địa chỉ của {userName}
          </Typography>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </DialogHeader>

        <DialogBody className="h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Audio color="#4fa94d" height={60} width={60} />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <Typography color="gray" className="text-center">
                Người dùng này chưa có địa chỉ nào
              </Typography>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div key={address._id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Typography variant="h6" className="mr-3">
                          {address.addressName}
                        </Typography>
                        {index === 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Mới nhất
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div><span className="font-medium">Địa chỉ:</span> {address.address}</div>
                        <div><span className="font-medium">Phường/Xã:</span> {address.ward}</div>
                        <div><span className="font-medium">Tỉnh/TP:</span> {address.province}</div>
                        <div>
                          <span className="font-medium">Ngày tạo:</span> {' '}
                          {new Date(address.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative ml-4">
                      <button
                        onClick={() => toggleDropdown(address._id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {activeDropdown === address._id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-50 border">
                          <div className="py-1">
                            <button
                              onClick={() => handleEdit(address)}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(address._id)}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Xóa
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button color="blue-gray" onClick={handleClose}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Dialog */}
      {showEditDialog && (
        <Dialog open={showEditDialog} handler={() => setShowEditDialog(false)} size="md">
          <DialogHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sửa địa chỉ</h3>
            <button
              onClick={() => setShowEditDialog(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </DialogHeader>
          <DialogBody>
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
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    setShowEditDialog(false)
                    setEditingItem(null)
                    setFormData({
                      addressName: '',
                      address: '',
                      ward: '',
                      province: ''
                    })
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  disabled={!formData.addressName || !formData.address || !formData.ward || !formData.province}
                >
                  Cập nhật
                </Button>
              </div>
            </form>
          </DialogBody>
        </Dialog>
      )}
    </>
  )
}

export default UserAddressDialog
