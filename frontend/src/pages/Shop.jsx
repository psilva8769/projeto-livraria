import React, { useContext, useEffect, useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { categories } from '../assets/data'
import { LuSettings2 } from "react-icons/lu"
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import Item from '../components/Item'
import Footer from '../components/Footer'

const Shop = () => {

  const { books } = useContext(ShopContext)
  const [category, setCategory] = useState([])
  const [sortType, setSortType] = useState("relevant")
  const [filteredBooks, setFilteredBooks] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1) // Página ativa
  const itemsPerPage = 10 // Número de livros por página

  const toggleFilter = (value, setState) => {
    setState((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])
  }

  const applyFilters = () => {
    let filtered = [...books]

    if (search) {
      filtered = filtered.filter((book) => book.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length) {
      filtered = filtered.filter((book) => category.includes(book.category))
    }
    return filtered
  }

  const applySorting = (booksList) => {
    switch (sortType) {
      case "low":
        return booksList.sort((a, b) => a.price - b.price)
      case "high":
        return booksList.sort((a, b) => b.price - a.price)
      default:
        return booksList // Padrão que é 'relevante'
    }
  }

  useEffect(() => {
    let filtered = applyFilters()
    let sorted = applySorting(filtered)
    setFilteredBooks(sorted)
    setCurrentPage(1) // Voltar para a primeira página quando filtros mudam
  }, [category, sortType, books, search])

  // Pega os livros para a página atual
  const getPaginatedBooks = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredBooks.slice(startIndex, endIndex)
  }

  // Número total de páginas
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  return (
    <section className='min-h-screen bg-gradient-to-br from-cream/30 via-white to-sage/20'>
      <div className='max-padd-container pt-32 pb-20'>
        {/* Caixa de pesquisa */}
        <div className='w-full max-w-3xl mx-auto mb-16'>
          <div className='inline-flex items-center justify-center bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full rounded-2xl p-5 px-6'>
            <div className='text-xl cursor-pointer text-secondary hover:text-navy transition-colors'><RiSearch2Line /></div>
            <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder='Pesquise por título, autor ou categoria...' className='border-none outline-none w-full text-sm pl-4 bg-transparent placeholder:text-tertiary/70' />
            <div className='flexCenter cursor-pointer text-xl text-secondary border-l border-gray-200/50 pl-4 hover:text-navy transition-colors'><LuSettings2 /></div>
          </div>
        </div>

        {/* Filtro de categorias */}
        <div className='mb-20'>
          <h4 className='h4 mb-8 text-navy bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent hidden sm:flex'>Categorias:</h4>
          <div className='flexCenter sm:flexStart flex-wrap gap-x-8 gap-y-6'>
            {categories.map((cat) => (
              <label key={cat.name} className='group'>
                <input value={cat.name} onChange={(e) => toggleFilter(e.target.value, setCategory)} type="checkbox" className='hidden peer' />
                <div className='flexCenter flex-col gap-3 peer-checked:text-secondary cursor-pointer transition-all duration-300 group-hover:scale-110'>
                  <div className='bg-gradient-to-br from-primary/20 to-secondary/10 h-20 w-20 flexCenter rounded-full shadow-lg hover:shadow-xl transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-secondary peer-checked:to-tertiary peer-checked:shadow-secondary/30 backdrop-blur-sm border border-white/30'>
                    <img src={cat.image} alt={cat.name} className='object-cover h-10 w-10 transition-transform duration-300 group-hover:scale-110' />
                  </div>
                  <span className='medium-14 text-tertiary group-hover:text-navy transition-colors peer-checked:text-secondary'>{cat.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Container de livros */}
        <div className='mt-12'>
          {/* título e ordenação */}
          <div className='flexBetween !items-start gap-7 flex-wrap pb-16 max-sm:flexCenter text-center'>
            <Title title1={'Nossa'} title2={'Lista de Livros'} titleStyles={'pb-0 text-start'} paraStyles={'!block'} />
            <div className='flexCenter gap-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50'>
              <span className='hidden sm:flex medium-16 text-navy'>Ordenar por:</span>
              <select onChange={(e) => setSortType(e.target.value)} className='text-sm p-3 outline-none bg-transparent text-tertiary rounded-xl border border-gray-200/50 hover:border-secondary/50 transition-all duration-300 cursor-pointer'>
                <option value="relevant">Relevância</option>
                <option value="low">Menor preço</option>
                <option value="high">Maior preço</option>
              </select>
            </div>
          </div>
          
          {/* Livros */}
          <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8'>
            {getPaginatedBooks().length > 0 ? (
              getPaginatedBooks().map((book, index) => (
                <div key={book._id} className={`animate-fadeInUp opacity-0 [animation-fill-mode:forwards]`} style={{animationDelay: `${index * 0.1}s`}}>
                  <Item book={book} />
                </div>
              ))
            ) : (
              <div className='col-span-full flexCenter flex-col gap-4 py-20'>
                <div className='w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flexCenter'>
                  <RiSearch2Line className='text-3xl text-gray-400' />
                </div>
                <p className='text-tertiary text-lg'>Nenhum livro encontrado para os filtros selecionados</p>
                <button onClick={() => {setCategory([]); setSearch("")}} className='btn-outline mt-4'>Limpar filtros</button>
              </div>
            )}
          </div>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className='flexCenter mt-16 mb-10 gap-3'>
            {/* Botão anterior */}
            <button disabled={currentPage === 1} 
            onClick={() => setCurrentPage((prev) => prev - 1)} 
            className={`px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 text-tertiary hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg ${currentPage === 1 && "opacity-50 cursor-not-allowed hover:bg-white/80 hover:text-tertiary"}`}>
              Anterior
            </button>
            
            {/* Números das páginas */}
            <div className='flex gap-2'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} onClick={()=>setCurrentPage(index + 1)} 
                className={`w-12 h-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  currentPage === index + 1 
                    ? "bg-gradient-to-br from-secondary to-tertiary text-white" 
                    : "bg-white/80 backdrop-blur-sm border border-gray-200/50 text-tertiary hover:bg-primary/20"
                }`}>
                  {index + 1}
                </button>
              ))}
            </div>
            
            {/* Botão próxima */}
            <button disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage((prev) => prev + 1)} 
            className={`px-6 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 text-tertiary hover:bg-secondary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg ${currentPage === totalPages && "opacity-50 cursor-not-allowed hover:bg-white/80 hover:text-tertiary"}`}>
              Próxima
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </section>
  )
}

export default Shop
