import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
    validada?: boolean;
    validacaomedica?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ validada, validacaomedica }) => {
    // Aceita ambos os nomes de prop
    const isValidada = validada ?? validacaomedica ?? false;
    
    const config = isValidada ? {
        label: 'Validada',
        color: 'var(--success-text)',
        bg: 'var(--success-bg)',
        icon: <CheckCircle size={16} />
    } : {
        label: 'Pendente',
        color: 'var(--warning-text)',
        bg: 'var(--warning-bg)',
        icon: <Clock size={16} />
    };

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 500,
            backgroundColor: config.bg,
            color: config.color
        }}>
            {config.icon}
            {config.label}
        </span>
    );
};

export default StatusBadge;
