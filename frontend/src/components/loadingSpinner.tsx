const LoadingSpinner = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-600">
			</div>
		</div>
	);
};

export default LoadingSpinner;