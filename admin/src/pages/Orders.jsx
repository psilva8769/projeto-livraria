import React from 'react'
import { useState, useEffect } from 'react'
import { backend_url, currency } from "../App"
import axios from "axios"
import { toast } from "react-toastify"
import { TfiPackage } from "react-icons/tfi"

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }
    try {
      const response = await axios.post(backend_url + '/api/order/list', {}, { headers: { token } })
      console.log(response.data)
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backend_url + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='px-2 sm:px-8 mt-4 sm:mt-14'>
      <div className='flex flex-col gap-4'>
        {orders.map((order) => (
          <div key={order._id} className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr] gap-4 items-start p-3 text-gray-700 bg-white rounded-lg'>
            <div className='hidden xl:block ring-1 ring-slate-900/5 rounded p-7 bg-primary'>
              <TfiPackage className='text-3xl text-secondary' />
            </div>
            <div>
              <div className='flex items-start gap-1'>
                <div className='medium-14'>Itens:</div>
                <div className='flex flex-col relative top-0.5'>
                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
              <p><span className='text-tertiary medium-14'>Nome:</span> {order.address.firstName + " " + order.address.lastName}</p>
              <p><span className='text-tertiary medium-14'>Endereço: </span>
                <span>{order.address.street + ", "}</span>
                <span>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</span>
              </p>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p><span className='text-tertiary medium-14'>Total de itens: </span>{order.items.length}</p>
              <p><span className='text-tertiary medium-14'>Método de pagamento: </span>{order.paymentMethod}</p>
              <p><span className='text-tertiary medium-14'>Pagamento: </span>{order.payment ? "Concluído" : "Pendente"}</p>
              <p><span className='text-tertiary medium-14'>Data: </span>{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p><span className='text-tertiary medium-14'>Preço: </span>{currency}{order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-1 ring-1 ring-slate-900/5 rounded max-w-36 bg-primary text-xs font-semibold'>
              <option value="Order Placed">Pedido realizado</option>
              <option value="Packing">Embalando</option>
              <option value="Shipped">Enviado</option>
              <option value="Out for delivery">Saiu para entrega</option>
              <option value="Delivered">Entregue</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
