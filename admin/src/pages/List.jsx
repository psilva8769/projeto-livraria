import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backend_url, currency } from '../App'
import { toast } from 'react-toastify'
import { TbTrash } from 'react-icons/tb'

const List = ({token}) => {

const [list, setList] = useState([])

const fetchlist = async ()=>{
  try {
    const response = await axios.get(backend_url + '/api/product/list')
   if(response.data.success){
    setList(response.data.products)
   } else {
    toast.error(response.data.message)
   }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

const removeProduct = async (id)=>{
  try {
    const response = await axios.post(backend_url + '/api/product/delete', {id}, {headers:{token}})
    if(response.data.success){
      toast.success('Produto removido com sucesso!')
      await fetchlist()
    }else{
      toast.error('Erro ao remover produto.')
    }
  } catch (error) {
    console.log(error)
    toast.error('Erro ao remover produto.')
  }
}

useEffect(()=>{
  fetchlist()
}, [])

  return (
    <div className='px-2 sm:px-8 mt-4 sm:mt-14'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] items-center py-1 px-2 bg-white bold-14 sm:bold-15 mb-1 rounded'>
          <h5>Imagem</h5>
          <h5>Nome</h5>
          <h5>Categoria</h5>
          <h5>Preço</h5>
          <h5>Remover</h5>
        </div>
        {/* Lista de Produtos */}
        {list.map((item)=> (
          <div key={item._id} className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] items-center gap-2 p-1 bg-white rounded-xl'>
            <img src={item.image} alt="" className='w-12 rounded-lg'/>
            <h5 className='text-sm font-semibold'>{item.name}</h5>
            <p className='font-semibold'>{item.category}</p>
            <div className='text-sm font-semibold'>{currency}{item.price}</div>
            <div><TbTrash onClick={()=> removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'/></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List