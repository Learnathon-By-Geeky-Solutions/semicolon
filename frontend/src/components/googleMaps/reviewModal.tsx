import React, { useState, useEffect } from 'react';
import { MdStar, MdStarBorder, MdClose, MdDelete } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { SERVER_URL } from '../../constants/paths';

interface ReviewModalProps {
  shelterId: string;
  onClose: () => void;
}

// Add interface for the review data
interface ExistingReview {
  _id: string;
  rating: number;
  review: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ shelterId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!user?._id) return;
      
      try {
        const { data } = await axios.get(
          `${SERVER_URL}/api/v1/shelterReviews/user/${user._id}/shelter/${shelterId}`
        );
        
        if (data) {
          setExistingReview(data);
          setRating(data.rating);
          setReview(data.review);
        }
      } catch (error) {
        console.error('Error fetching existing review:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingReview();
  }, [shelterId, user?._id]);

  const handleDelete = async () => {
    if (!existingReview?._id || !window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${SERVER_URL}/api/v1/shelterReviews/delete`, {
        _id: existingReview._id,
      });
      toast.success('Review deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting review:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete review');
      } else {
        toast.error('Failed to delete review');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) {
      toast.error('You must be logged in to leave a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = existingReview 
        ? `${SERVER_URL}/api/v1/shelterReviews/update`
        : `${SERVER_URL}/api/v1/shelterReviews/create`;

      const payload = existingReview 
        ? {
            _id: existingReview._id,
            shelter_id: shelterId,
            user_id: user._id,
            rating,
            review: review.trim()
          }
        : {
            shelter_id: shelterId,
            user_id: user._id,
            rating,
            review: review.trim()
          };

      if (existingReview) {
        await axios.post(endpoint, payload);
      } else {
        await axios.post(endpoint, payload);
      }
      
      toast.success(existingReview ? 'Review updated successfully' : 'Review submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      } else {
        toast.error('Failed to submit review');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {existingReview ? 'Update Your Review' : 'Rate this Shelter'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
          >
            <MdClose size={20} />
          </button>
        </div>
        
        {/* Star Rating */}
        <div className="flex gap-1 mb-4 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="text-3xl text-yellow-400 transition-transform hover:scale-110"
            >
              {star <= (hoveredRating || rating) ? <MdStar /> : <MdStarBorder />}
            </button>
          ))}
        </div>

        {/* Review Text */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience (optional)"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 
          focus:ring-green-500 focus:border-transparent min-h-[100px] resize-none"
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          {existingReview && (
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2 text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <MdDelete size={20} />
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}; 