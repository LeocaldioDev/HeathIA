import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PagedResult } from '../../types';

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: PagedResult<T> | null;
    columns: Column<T>[];
    onPageChange: (page: number) => void;
    loading?: boolean;
}

function Table<T extends { id: number | string }>({ data, columns, onPageChange, loading }: TableProps<T>) {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Carregando...</div>
            </div>
        );
    }

    if (!data || !data.items || data.items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Nenhum registro encontrado</div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--primary-color)' }}>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={{
                                        padding: '12px',
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        color: 'var(--primary-color)'
                                    }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, index) => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: '1px solid #e0e0e0',
                                    backgroundColor: index % 2 === 0 ? 'white' : 'var(--secondary-color)'
                                }}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} style={{ padding: '12px' }}>
                                        {col.render ? col.render(item) : (item as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                padding: '12px 0'
            }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Mostrando {data.items.length} de {data.totalCount} registros
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => onPageChange(data.currentPage - 1)}
                        disabled={data.currentPage === 1}
                        style={{
                            padding: '8px 12px',
                            opacity: data.currentPage === 1 ? 0.5 : 1,
                            cursor: data.currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Página {data.currentPage} de {data.totalPages}
                    </span>
                    <button
                        className="btn btn-outline"
                        onClick={() => onPageChange(data.currentPage + 1)}
                        disabled={data.currentPage >= data.totalPages}
                        style={{
                            padding: '8px 12px',
                            opacity: data.currentPage >= data.totalPages ? 0.5 : 1,
                            cursor: data.currentPage >= data.totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Table;
