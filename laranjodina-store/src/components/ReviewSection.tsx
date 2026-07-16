import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { useAuthStore } from './store/authStore';
import toast from 'react-hot-toast';

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    timestamp: number;
}

interface ReviewSectionProps {
    productSlug: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productSlug }) => {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const reviewsRef = ref(db, `reviews/${productSlug}`);
        const unsubscribe = onValue(reviewsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const reviewsList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => b.timestamp - a.timestamp);
                setReviews(reviewsList);
            } else {
                setReviews([]);
            }
        });

        return () => unsubscribe();
    }, [productSlug]);

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
                userName: user.name,
                rating,
                comment,
                timestamp: serverTimestamp()
            });
            setComment('');
            setRating(5);
            toast.success('Avaliação enviada!');
        } catch (error) {
            toast.error('Erro ao enviar avaliação.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '3rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
            <h3 className="text-uppercase-black" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Avaliações dos Clientes</h3>
            
            {user ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{color: 'var(--text-muted)'}}>Sua nota:</span>
                        <select 
                            value={rating} 
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="form-input"
                            style={{ width: '100px', padding: '5px' }}
                        >
                            {[5,4,3,2,1].map(num => (
                                <option key={num} value={num}>{num} ⭐</option>
                            ))}
                        </select>
                    </div>
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="O que achou deste produto?"
                        className="form-input"
                        style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                    <button type="submit" className="btn-accent" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
                        {isSubmitting ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
                    </button>
                </form>
            ) : (
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Faça login para deixar sua avaliação.
                </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Seja o primeiro a avaliar!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--color-white)' }}>{review.userName}</strong>
                                <span style={{ color: '#ffb400' }}>{'⭐'.repeat(review.rating)}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{review.comment}</p>
                            {review.timestamp && (
                                <small style={{ color: '#555', marginTop: '0.5rem', display: 'block' }}>
                                    {new Date(review.timestamp).toLocaleDateString('pt-BR')}
                                </small>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
