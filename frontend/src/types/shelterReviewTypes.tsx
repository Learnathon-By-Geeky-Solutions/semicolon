export interface ReviewModalProps {
    shelterId: string;
    onClose: () => void;
  }
  
  // Add interface for the review data
export interface ExistingReview {
    _id: string;
    rating: number;
    review: string;
  }

export interface ReviewsModalProps {
shelterId: string;
shelterName: string;
onClose: () => void;
}

export interface Review {
_id: string;
user_id: string;
rating: number;
review: string;
createdAt: string;
updatedAt: string;
user?: {
    name: string;
};
}