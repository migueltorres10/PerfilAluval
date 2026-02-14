import React from 'react';

/**
 * Reusable Button component.
 * Uses global styles from appShell.css.
 * 
 * @param {Object} props
 * @param {'primary' | 'danger' | 'success'} [props.variant='primary'] - Button variant
 * @param {boolean} [props.loading=false] - Shows loading text/spinner if true
 * @param {string} [props.loadingText] - Text to show when loading (default: "A carregar...")
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children
 */
export function Button({
    variant = 'primary',
    loading = false,
    loadingText = "A carregar...",
    className = '',
    disabled,
    children,
    ...props
}) {
    let variantClass = '';
    if (variant === 'danger') variantClass = 'btnDanger';
    else if (variant === 'success') variantClass = 'btnSuccess';

    return (
        <button
            className={`${variantClass} ${className}`.trim()}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    );
}
