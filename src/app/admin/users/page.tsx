'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white font-display uppercase tracking-wider">Gerenciar Usuários</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" /> Novo Usuário
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <input
              type="text"
              placeholder="Buscar usuários..."
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Função</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Pedidos</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-[#222] hover:bg-[#111]">
                      <td className="py-3 px-4 font-medium text-white">{user.name}</td>
                      <td className="py-3 px-4 text-[#aaa] font-mono text-xs uppercase">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-[#222] border border-[#333] text-white'
                        }`}>
                          {user.role === 'ADMIN' ? (
                            <><Shield className="w-3 h-3 inline mr-1" /> Admin</>
                          ) : 'Usuário'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-mono text-xs uppercase">{user._count.orders}</td>
                      <td className="py-3 px-4 text-[#aaa] font-mono text-xs uppercase">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && <CreateUserModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchUsers(); }} />}
    </div>
  );
}

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Usuário criado!');
        onSuccess();
      } else {
        throw new Error('Erro');
      }
    } catch (error) {
      toast.error('Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Novo Usuário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#ccc] mb-1">Nome</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#ccc] mb-1">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#ccc] mb-1">Senha</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#ccc] mb-1">Função</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors">
              <option className="bg-[#111] text-white" value="USER">Usuário</option>
              <option className="bg-[#111] text-white" value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}