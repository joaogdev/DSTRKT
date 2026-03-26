'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Filter } from 'lucide-react';

interface Log {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  userId: string | null;
  user: { name: string; email: string } | null;
  ipAddress: string | null;
  createdAt: string;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  USER_LOGIN: { label: 'Login', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  USER_CREATED: { label: 'Usuário Criado', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  PROFILE_UPDATED: { label: 'Perfil Atualizado', color: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' },
  ORDER_CREATED: { label: 'Pedido Criado', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  ORDER_STATUS_UPDATED: { label: 'Status Atualizado', color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  PRODUCT_CREATED: { label: 'Produto Criado', color: 'bg-emerald-100 text-emerald-800' },
  PRODUCT_UPDATED: { label: 'Produto Atualizado', color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' },
  PRODUCT_DELETED: { label: 'Produto Excluído', color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (action) params.set('action', action);
    if (entityType) params.set('entityType', entityType);
    params.set('page', page.toString());
    params.set('limit', '20');

    try {
      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, [action, entityType, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white font-display uppercase tracking-wider mb-8">Logs de Auditoria</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors w-full md:w-48">
            <option value="">Todas as ações</option>
            {Object.entries(actionLabels).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }} className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors w-full md:w-48">
            <option value="">Todas as entidades</option>
            <option value="User">Usuário</option>
            <option value="Order">Pedido</option>
            <option value="Product">Produto</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#888] font-mono text-xs uppercase">Nenhum log encontrado</p>
          </div>
        ) : (
          <>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Data/Hora</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Ação</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Entidade</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Usuário</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-white font-mono text-xs uppercase">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const actionConfig = actionLabels[log.action];
                      let details = '';
                      try { details = log.details ? JSON.stringify(JSON.parse(log.details), null, 0).slice(0, 60) : '-'; } catch { details = log.details || '-'; }

                      return (
                        <tr key={log.id} className="border-t border-[#222] hover:bg-[#111]">
                          <td className="py-3 px-4 text-white font-mono text-xs uppercase">
                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionConfig?.color || 'bg-[#222] border border-[#333] text-white'}`}>
                              {actionConfig?.label || log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className="text-[#aaa]">{log.entityType}</span>
                            <span className="text-[#666] text-xs block">{log.entityId.slice(0, 12)}...</span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {log.user ? (
                              <div>
                                <p className="font-medium">{log.user.name}</p>
                                <p className="text-[#666] text-xs">{log.user.email}</p>
                              </div>
                            ) : (
                              <span className="text-[#666]">Sistema</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-[#aaa] font-mono text-xs uppercase max-w-xs truncate">{details}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn btn-outline text-sm disabled:opacity-50">
                  Anterior
                </button>
                <span className="text-sm text-[#888] font-mono text-xs uppercase">
                  Página {page} de {totalPages}
                </span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="btn btn-outline text-sm disabled:opacity-50">
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
