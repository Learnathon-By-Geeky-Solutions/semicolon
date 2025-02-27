import { useEffect, useState } from 'react';
import { getDistricts } from '../helpers/district';
import { District } from '../types/districtTypes';
import { Shelter, ShelterWithStats } from '../types/shelterMapTypes';
import LoadingSpinner from '../components/loadingSpinner';
import { ResourceType, ResourceLabels } from '../types/resourceAnalyticsTypes';
import PageLayout from '../components/layout/pageLayout';
import { mainNavItems } from '../config/navigation';
import { MdStar, MdStarBorder, MdSort, MdComment } from 'react-icons/md';
import axios from 'axios';
import { SERVER_URL } from '../constants/paths';
import { ReviewsModal } from '../components/googleMaps/reviewsModal';

interface ShelterWithRating extends Shelter {
  averageRating: number;
  reviewCount: number;
}

type SortField = 'name' | 'food' | 'water' | 'medicine' | 'rating';
type SortOrder = 'asc' | 'desc';

const ShelterAnalyticsPage = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [shelters, setShelters] = useState<ShelterWithRating[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  const resourceLabels: ResourceLabels = {
    food: "Food Supplies",
    water: "Water Supplies",
    medicine: "Medical Supplies"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsData, sheltersResponse] = await Promise.all([
          getDistricts(),
          axios.get(`${SERVER_URL}/api/v1/shelters/allWithRatings`)
        ]);

        const sheltersWithRatings = sheltersResponse.data.map((item: ShelterWithStats) => ({
          ...item.shelter,
          averageRating: item.averageRating,
          reviewCount: item.reviewCount
        }));
        
        setDistricts(districtsData);
        setShelters(sheltersWithRatings);
        if (districtsData.length > 0) {
          setSelectedDistrictId(districtsData[0]._id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-yellow-400">
          {star <= rating ? <MdStar /> : <MdStarBorder />}
        </span>
      ))}
    </div>
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <MdSort className="ml-1" />;
    return (
      <span className="ml-1">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const filteredAndSortedShelters = shelters
    .filter(shelter => selectedDistrictId === "all" || shelter.district_id === selectedDistrictId)
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.averageRating - b.averageRating;
          break;
        default:
          comparison = (a[sortField] || 0) - (b[sortField] || 0);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <PageLayout
      title="Shelter Reviews & Resources"
      navItems={mainNavItems}
      headerRightContent={
        <select
          value={selectedDistrictId}
          onChange={(e) => setSelectedDistrictId(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Districts</option>
          {districts.map(district => (
            <option key={district._id} value={district._id}>
              {district.district_name}
            </option>
          ))}
        </select>
      }
    >
      {loading ? <LoadingSpinner /> : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Shelter Name
                        <SortIcon field="name" />
                      </div>
                    </th>
                    {Object.entries(resourceLabels).map(([key, label]) => (
                      <th 
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort(key as SortField)}
                      >
                        <div className="flex items-center">
                          {label}
                          <SortIcon field={key as SortField} />
                        </div>
                      </th>
                    ))}
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center">
                        Rating
                        <SortIcon field="rating" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedShelters.map((shelter) => (
                    <tr key={shelter._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{shelter.name}</div>
                      </td>
                      {Object.keys(resourceLabels).map(resource => (
                        <td key={resource} className="px-6 py-4">
                          {shelter[resource as ResourceType]?.toLocaleString()}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StarRating rating={Math.round(shelter.averageRating)} />
                          <span className="text-sm text-gray-500">
                            ({shelter.reviewCount})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedShelterId(shelter._id);
                            setIsReviewsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <MdComment />
                          Reviews
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {isReviewsModalOpen && selectedShelterId && (
        <ReviewsModal
          shelterId={selectedShelterId}
          shelterName={shelters.find(s => s._id === selectedShelterId)?.name || ''}
          onClose={() => {
            setIsReviewsModalOpen(false);
            setSelectedShelterId(null);
          }}
        />
      )}
    </PageLayout>
  );
};

export default ShelterAnalyticsPage;
