
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { MdStar, MdStarBorder, MdClose } from 'react-icons/md';
import { SERVER_URL } from '../../constants/paths';
import { ReviewsModalProps, Review } from '../../types/shelterReviewTypes';


  
  export const ReviewsModal: React.FC<ReviewsModalProps> = ({ shelterId, shelterName, onClose }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const { data } = await axios.post(`${SERVER_URL}/api/v1/shelterReviews/getReviewsByShelterId`, {
            shelter_id: shelterId
          });
          setReviews(data);
          
          // Calculate average rating
          if (data.length > 0) {
            const avg = data.reduce((acc: number, curr: Review) => acc + curr.rating, 0) / data.length;
            setAverageRating(Math.round(avg * 10) / 10); // Round to 1 decimal place
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchReviews();
    }, [shelterId]);
  
    const StarRating = ({ rating }: { rating: number }) => (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">
            {star <= rating ? <MdStar /> : <MdStarBorder />}
          </span>
        ))}
      </div>
    );
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{shelterName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={averageRating} />
                <span className="text-gray-600">
                  {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
            >
              <MdClose size={20} />
            </button>
          </div>
  
          {/* Reviews List */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No reviews yet for this shelter.
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">
                          {review.user?.name || 'Anonymous User'}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} />
                          <span className="text-sm text-gray-500">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.review && (
                      <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                        {review.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
export default ReviewsModal;