import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { ref, push, onValue, serverTimestamp, update } from 'firebase/database';
import { useAuthStore } from './store/authStore';
import toast from 'react-hot-toast';
import { FiCamera, FiThumbsUp, FiMoreVertical, FiArrowLeft, FiX, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

export interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    timestamp: number;
    images?: string[];
    likes?: number;
    location?: string;
    isVerifiedPurchase?: boolean;
}

interface ReviewSectionProps {
    productSlug: string;
}

interface PhotoItem {
    imageUrl: string;
    review: Review;
    globalIndex: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productSlug }) => {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [photoInputUrl, setPhotoInputUrl] = useState('');
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal de Opiniões com Fotos (Estilo Mercado Livre)
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [activePhotoGlobalIndex, setActivePhotoGlobalIndex] = useState(0);
    const [likedReviewIds, setLikedReviewIds] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const reviewsRef = ref(db, `reviews/${productSlug}`);
        const unsubscribe = onValue(reviewsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dbReviews: Review[] = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                dbReviews.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                setReviews(dbReviews);
            } else {
                setReviews([]);
            }
        });

        return () => unsubscribe();
    }, [productSlug]);

    const allPhotoItems: PhotoItem[] = [];
    reviews.forEach((rev) => {
        if (rev.images && rev.images.length > 0) {
            rev.images.forEach((img) => {
                allPhotoItems.push({
                    imageUrl: img,
                    review: rev,
                    globalIndex: allPhotoItems.length
                });
            });
        }
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : '0.0';

    const ratingCounts = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => Math.round(r.rating) === star).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { star, count, percentage };
    });

    const handleAddPhotoUrl = () => {
        if (!photoInputUrl.trim()) return;
        if (photoUrls.length >= 5) {
            toast.error('Você pode adicionar no máximo 5 fotos.');
            return;
        }
        setPhotoUrls([...photoUrls, photoInputUrl.trim()]);
        setPhotoInputUrl('');
    };

    const handleRemovePhotoUrl = (index: number) => {
        setPhotoUrls(photoUrls.filter((_, i) => i !== index));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (photoUrls.length + files.length > 5) {
            toast.error('Você pode adicionar no máximo 5 fotos.');
            return;
        }

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setPhotoUrls(prev => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Você precisa estar logado para avaliar!');
            return;
        }

        if (!comment.trim()) {
            toast.error('O comentário não pode ser vazio.');
            return;
        }

        setIsSubmitting(true);
        try {
            await push(ref(db, `reviews/${productSlug}`), {
                userName: user.name || 'Cliente Laranjodina',
                rating,
                comment,
                timestamp: serverTimestamp(),
                images: photoUrls,
                likes: 0,
                location: 'Brasil',
                isVerifiedPurchase: true
            });
            setComment('');
            setRating(5);
            setPhotoUrls([]);
            setPhotoInputUrl('');
            toast.success('Avaliação enviada com sucesso!');
        } catch (error) {
            toast.error('Erro ao enviar avaliação.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeReview = (reviewId: string, currentLikes = 0) => {
        const isLiked = likedReviewIds[reviewId];
        const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
        setLikedReviewIds(prev => ({ ...prev, [reviewId]: !isLiked }));

        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: Math.max(0, newLikes) } : r));

        update(ref(db, `reviews/${productSlug}/${reviewId}`), {
            likes: Math.max(0, newLikes)
        }).catch(() => {});
    };

    const openPhotoModal = (globalIndex: number) => {
        setActivePhotoGlobalIndex(globalIndex);
        setIsPhotoModalOpen(true);
    };

    const currentPhotoItem = allPhotoItems[activePhotoGlobalIndex];

    const formatRelativeDate = (timestamp: number) => {
        if (!timestamp) return 'Há pouco tempo';
        const diffMs = Date.now() - timestamp;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 1) return 'Hoje';
        if (diffDays < 30) return `Há ${diffDays} dias`;
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) return `Há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
        const diffYears = Math.floor(diffMonths / 12);
        return `Há ${diffYears} ${diffYears === 1 ? 'ano' : 'anos'}`;
    };

    return (
        <div className="review-section-container">
            <h3 className="text-uppercase-black" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>
                Opiniões do Produto
            </h3>

            {/* Painel de Resumo de Notas (Exibido se houver avaliações reais) */}
            {totalReviews > 0 && (
                <div className="review-summary-box">
                    <div className="review-score-big">
                        <span className="review-score-num">{avgRating}</span>
                        <div className="review-score-stars">
                            {'★'.repeat(Math.round(Number(avgRating)))}{'☆'.repeat(5 - Math.round(Number(avgRating)))}
                        </div>
                        <span className="review-score-total">{totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}</span>
                    </div>

                    <div className="review-bars-list">
                        {ratingCounts.map(item => (
                            <div key={item.star} className="review-bar-item">
                                <span style={{ width: '24px' }}>{item.star}★</span>
                                <div className="review-bar-track">
                                    <div className="review-bar-fill" style={{ width: `${item.percentage}%` }}></div>
                                </div>
                                <span style={{ width: '35px', textAlign: 'right' }}>{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Carrossel de Opiniões com Fotos Reais dos Usuários */}
            {allPhotoItems.length > 0 && (
                <div className="review-photos-header">
                    <div className="review-photos-title">
                        <span>📸 Opiniões com fotos ({allPhotoItems.length})</span>
                        <button 
                            type="button" 
                            onClick={() => openPhotoModal(0)}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'var(--accent)', 
                                fontSize: '0.85rem', 
                                fontWeight: 'bold', 
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Ver todas as fotos ({allPhotoItems.length})
                        </button>
                    </div>

                    <div className="review-photos-carousel">
                        {allPhotoItems.slice(0, 10).map((item, index) => (
                            <div 
                                key={index} 
                                className="review-photo-thumb-card" 
                                onClick={() => openPhotoModal(index)}
                                title={`Foto por ${item.review.userName}`}
                            >
                                <img src={item.imageUrl} alt={`Avaliação de ${item.review.userName}`} />
                                {index === 9 && allPhotoItems.length > 10 && (
                                    <div className="review-photo-more-overlay">
                                        +{allPhotoItems.length - 10}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form de Envio de Avaliação */}
            {user ? (
                <form onSubmit={handleSubmit} style={{ backgroundColor: '#181818', padding: '1.25rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #282828' }}>
                    <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Deixe sua avaliação com foto</h4>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sua nota:</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '1.5rem',
                                        color: star <= rating ? '#ffb400' : '#444',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="O que achou deste produto? Conte detalhes sobre tamanho, qualidade e conforto..."
                        className="form-input"
                        style={{ width: '100%', minHeight: '85px', resize: 'vertical', marginBottom: '12px' }}
                    />

                    {/* Adicionar Fotos */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                            <FiCamera color="var(--accent)" /> Adicionar fotos da sua compra (opcional):
                        </label>
                        
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <input 
                                type="url" 
                                placeholder="Cole o link da foto (URL)..." 
                                value={photoInputUrl} 
                                onChange={(e) => setPhotoInputUrl(e.target.value)}
                                className="form-input"
                                style={{ flex: 1, minWidth: '200px', fontSize: '0.85rem', padding: '8px 12px' }}
                            />
                            <button 
                                type="button" 
                                onClick={handleAddPhotoUrl} 
                                className="btn-outline" 
                                style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                            >
                                Adicionar URL
                            </button>
                            
                            <label className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                📁 Enviar Foto
                                <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                        </div>

                        {photoUrls.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {photoUrls.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                                        <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button 
                                            type="button" 
                                            className="review-photo-remove-btn"
                                            onClick={() => handleRemovePhotoUrl(idx)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-accent" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
                        {isSubmitting ? 'ENVIANDO...' : 'PUBLICAR AVALIAÇÃO'}
                    </button>
                </form>
            ) : (
                <div style={{ backgroundColor: '#181818', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                        Faça login na sua conta para deixar uma avaliação com foto.
                    </p>
                </div>
            )}

            {/* Lista de Avaliações Reais dos Clientes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', backgroundColor: '#181818', padding: '1.25rem', borderRadius: '8px', border: '1px solid #262626' }}>
                        Ainda não há avaliações para este produto. Seja o primeiro a avaliar!
                    </p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} style={{ backgroundColor: '#181818', padding: '1.25rem', borderRadius: '10px', border: '1px solid #262626' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                                <div>
                                    <strong style={{ color: 'var(--color-white)', fontSize: '0.95rem' }}>{review.userName}</strong>
                                    {review.isVerifiedPurchase && (
                                        <span style={{ marginLeft: '8px', color: '#22c55e', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            <FiCheckCircle size={12} /> Compra verificada
                                        </span>
                                    )}
                                </div>
                                <span style={{ color: '#ffb400', fontSize: '0.95rem' }}>{'★'.repeat(review.rating)}</span>
                            </div>

                            <p style={{ color: '#dddddd', margin: '0 0 10px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>{review.comment}</p>

                            {review.images && review.images.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    {review.images.map((imgUrl, imgIdx) => {
                                        const globalIdx = allPhotoItems.findIndex(p => p.imageUrl === imgUrl && p.review.id === review.id);
                                        return (
                                            <img
                                                key={imgIdx}
                                                src={imgUrl}
                                                alt={`Foto de ${review.userName}`}
                                                onClick={() => globalIdx !== -1 && openPhotoModal(globalIdx)}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    borderRadius: '6px',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    border: '1px solid #333'
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                                    {review.location || 'Brasil'} • {formatRelativeDate(review.timestamp)}
                                </small>

                                <button
                                    type="button"
                                    onClick={() => handleLikeReview(review.id, review.likes)}
                                    style={{
                                        background: likedReviewIds[review.id] ? '#2a2a2a' : 'transparent',
                                        border: '1px solid #333',
                                        color: likedReviewIds[review.id] ? 'var(--accent)' : '#888',
                                        padding: '4px 10px',
                                        borderRadius: '15px',
                                        fontSize: '0.78rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    <FiThumbsUp size={12} /> É útil ({review.likes || 0})
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL DE OPINIÕES COM FOTOS (ESTILO MERCADO LIVRE) */}
            {isPhotoModalOpen && currentPhotoItem && (
                <div className="ml-modal-backdrop" onClick={() => setIsPhotoModalOpen(false)}>
                    <div className="ml-modal-container" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="ml-modal-header">
                            <button 
                                type="button" 
                                className="ml-modal-title-btn"
                                onClick={() => setIsPhotoModalOpen(false)}
                            >
                                <FiArrowLeft size={18} />
                                <span>Opiniões com fotos</span>
                            </button>

                            <button 
                                type="button" 
                                className="ml-modal-close-btn"
                                onClick={() => setIsPhotoModalOpen(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="ml-modal-content">
                            <div className="ml-modal-photo-column">
                                <div className="ml-modal-main-image-wrap">
                                    {allPhotoItems.length > 1 && (
                                        <button 
                                            type="button" 
                                            className="ml-modal-nav-btn prev"
                                            onClick={() => setActivePhotoGlobalIndex(prev => prev > 0 ? prev - 1 : allPhotoItems.length - 1)}
                                        >
                                            <FiChevronLeft />
                                        </button>
                                    )}

                                    <img 
                                        src={currentPhotoItem.imageUrl} 
                                        alt={`Opinião com foto ${activePhotoGlobalIndex + 1}`} 
                                        className="ml-modal-main-image" 
                                    />

                                    {allPhotoItems.length > 1 && (
                                        <button 
                                            type="button" 
                                            className="ml-modal-nav-btn next"
                                            onClick={() => setActivePhotoGlobalIndex(prev => prev < allPhotoItems.length - 1 ? prev + 1 : 0)}
                                        >
                                            <FiChevronRight />
                                        </button>
                                    )}
                                </div>

                                <div className="ml-modal-photo-counter">
                                    {activePhotoGlobalIndex + 1} / {allPhotoItems.length}
                                </div>

                                <div className="ml-modal-thumbs-row">
                                    {allPhotoItems.map((thumb, idx) => (
                                        <img 
                                            key={idx}
                                            src={thumb.imageUrl}
                                            alt={`Thumb ${idx + 1}`}
                                            className={`ml-modal-thumb ${idx === activePhotoGlobalIndex ? 'active' : ''}`}
                                            onClick={() => setActivePhotoGlobalIndex(idx)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="ml-modal-details-column">
                                <div className="ml-modal-user-info">
                                    <div className="ml-modal-stars">
                                        {'★'.repeat(currentPhotoItem.review.rating)}{'☆'.repeat(5 - currentPhotoItem.review.rating)}
                                    </div>

                                    <p className="ml-modal-review-text">
                                        {currentPhotoItem.review.comment}
                                    </p>

                                    <div className="ml-modal-meta">
                                        <span>{currentPhotoItem.review.location || 'Brasil'}</span>
                                        <span>•</span>
                                        <span>{formatRelativeDate(currentPhotoItem.review.timestamp)}</span>
                                        {currentPhotoItem.review.isVerifiedPurchase && (
                                            <span className="ml-modal-verified-tag">Compra verificada</span>
                                        )}
                                    </div>
                                </div>

                                <div className="ml-modal-actions">
                                    <button 
                                        type="button" 
                                        className={`ml-modal-util-btn ${likedReviewIds[currentPhotoItem.review.id] ? 'liked' : ''}`}
                                        onClick={() => handleLikeReview(currentPhotoItem.review.id, currentPhotoItem.review.likes)}
                                    >
                                        <FiThumbsUp size={14} /> 
                                        <span>Útil ({currentPhotoItem.review.likes || 0})</span>
                                    </button>

                                    <button 
                                        type="button" 
                                        className="ml-modal-more-btn"
                                        onClick={() => toast('Obrigado pelo feedback!', { icon: 'ℹ️' })}
                                        title="Mais opções"
                                    >
                                        <FiMoreVertical />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
