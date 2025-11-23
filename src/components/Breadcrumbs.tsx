// src/components/Breadcrumbs.tsx

import React from 'react';
import { Link } from 'react-router-dom';

// Define o formato esperado para cada item no caminho
interface BreadcrumbItem {
    label: string;
    path: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="breadcrumbs-nav" aria-label="breadcrumb">
            <ol className="breadcrumbs-list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    
                    return (
                        <li key={item.path} className="breadcrumbs-item">
                            {/* O último item não é um link, é o título atual */}
                            {isLast ? (
                                <span className="breadcrumbs-current-label">
                                    {item.label}
                                </span>
                            ) : (
                                <>
                                    <Link to={item.path} className="breadcrumbs-link">
                                        {item.label}
                                    </Link>
                                    <span className="breadcrumbs-separator">/</span>
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;