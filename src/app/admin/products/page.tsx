'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductImage } from '@/components/ui/ProductImage';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  category: { name: string };
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    try {
      const res = await fetch(`/api/admin/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Produto excluído');
        fetchProducts();
      } else {
        throw new Error('Erro ao excluir');
      }
    } catch (error) {
      toast.error('Erro ao excluir produto');
    }
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white font-display uppercase tracking-wider">Gerenciar Produtos</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#888] font-mono text-xs uppercase">Produto</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#888] font-mono text-xs uppercase">SKU</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#888] font-mono text-xs uppercase">Categoria</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#888] font-mono text-xs uppercase">Preço</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#888] font-mono text-xs uppercase">Estoque</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#888] font-mono text-xs uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    let productImages: string[] = [];
                    try {
                      productImages = typeof (product.images as any) === 'string'
                        ? JSON.parse(product.images as any)
                        : (product.images || []);
                    } catch { productImages = []; }
                    return (
                    <tr key={product.id} className="border-t hover:bg-black">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#222] border border-[#333] rounded-lg overflow-hidden relative">
                            {productImages[0] ? (
                              <ProductImage src={productImages[0]} alt={product.name} className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-[#666] text-xs">-</div>
                            )}
                          </div>
                          <span className="font-medium text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#888] font-mono text-xs uppercase">{product.sku}</td>
                      <td className="py-3 px-4 text-[#888] font-mono text-xs uppercase">{product.category?.name}</td>
                      <td className="py-3 px-4 font-medium text-white">{formatPrice(product.price)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {product.stock <= product.minStock && (
                            <AlertCircle className="w-4 h-4 text-[var(--accent-red)]" />
                          )}
                          <span className={product.stock <= product.minStock ? 'text-[var(--accent-red)] font-bold' : 'text-white'}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-[#888] font-mono text-xs uppercase hover:text-primary-600 hover:bg-[#222] border border-[#333] rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-[#888] font-mono text-xs uppercase hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal categories={categories} onClose={() => setShowModal(false)} onSuccess={() => {
          setShowModal(false);
          fetchProducts();
        }} />
      )}
    </div>
  );
}

function ProductModal({ categories, onClose, onSuccess }: { categories: any[]; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', sku: '', stock: '', categoryId: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Produto criado!');
        onSuccess();
      } else {
        throw new Error('Erro');
      }
    } catch (error) {
      toast.error('Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Novo Produto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#ccc] mb-1">Nome</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#ccc] mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1">Preço</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1">SKU</label>
              <input
                type="text"
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1">Estoque</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-1">Categoria</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors"
              >
                <option className="bg-[#111] text-white" value="">Selecione</option>
                {categories.map((cat) => (
                  <option className="bg-[#111] text-white" key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}