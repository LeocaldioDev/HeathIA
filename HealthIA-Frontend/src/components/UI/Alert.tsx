import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    const config = {
        success: {
            bg: 'var(--success-bg)',
            color: 'var(--success-text)',
            icon: <CheckCircle size={20} />
        },
        error: {
            bg: 'var(--error-bg)',
            color: 'var(--error-text)',
            icon: <XCircle size={20} />
        },
        warning: {
            bg: 'var(--warning-bg)',
            color: 'var(--warning-text)',
            icon: <AlertCircle size={20} />
        },
        info: {
            bg: 'var(--secondary-color)',
            color: 'var(--primary-color)',
            icon: <Info size={20} />
        }
    };

    const style = config[type];

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: style.bg,
            color: style.color,
            marginBottom: '16px'
        }}>
            {style.icon}
            <div style={{ flex: 1 }}>{message}</div>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'inherit',
                        padding: '4px'
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Alert;
