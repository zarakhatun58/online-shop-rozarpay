import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, selectProducts, selectProductsStatus } from '../features/products/productSlice'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/ui/Spinner'
import { Input } from '../components/ui/input'

export default function Home(){
  const d = useDispatch<any>()
  const products = useSelector(selectProducts)
  const status = useSelector(selectProductsStatus)
  const [search, setSearch] = useState('')

  useEffect(()=>{ d(fetchProducts()) }, [d])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <section className="space-y-6 px-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Discover Products</h1>
          <p className="text-gray-600">Browse our curated selection</p>
        </div>
        <div className="sm:w-64">
          <Input placeholder="Search products..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
        </div>
      </div>
      {status==='loading' && <div className="flex justify-center py-10"><Spinner/></div>}
      {status!=='loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          {filtered.length===0 && <p className="text-gray-500">No products found.</p>}
        </div>
      )}
    </section>
  )
}
