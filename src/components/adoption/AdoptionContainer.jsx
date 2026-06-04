import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import AdoptionSteps from './AdoptionSteps';
import AdoptionCard from './AdoptionCard';
import AdoptionModal from './AdoptionModal';
import PetDetailStage from './PetDetailStage';
import PetFormStage from './PetFormStage';
import PetSuccessStage from './PetSuccessStage';

const DUMMY_PETS = [
  { id: 1, name: 'Max', type: 'Anjing', breed: 'Golden Retriever Mix', age: '2 Tahun', gender: 'Jantan', location: 'Denpasar Barat', tags: ['Vaksin', 'Steril', 'Sehat'], shelter: 'Shelter Harapan Hewan', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500' },
  { id: 2, name: 'Luna', type: 'Kucing', breed: 'Domestic Shorthair', age: '1.5 Tahun', gender: 'Betina', location: 'Kuta Utara', tags: ['Vaksin', 'Steril', 'Sehat'], shelter: 'Cat Haven Kuta Utara', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=500' },
  { id: 3, name: 'Brownie', type: 'Anjing', breed: 'Labrador Mix', age: '2 Tahun', gender: 'Jantan', location: 'Denpasar Timur', tags: ['Vaksin', 'Sehat'], shelter: 'Paws For Life', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500' },
  { id: 4, name: 'Mochi', type: 'Kucing', breed: 'Persian Mix', age: '4 Tahun', gender: 'Betina', location: 'Kuta Utara', tags: ['Vaksin', 'Steril', 'Perlu perawatan rutin'], shelter: 'Animal Care Indonesia', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=500' },
  { id: 5, name: 'Coco', type: 'Kelinci', breed: 'Holland Lop', age: '8 Bulan', gender: 'Betina', location: 'Kuta Selatan', tags: ['Sehat'], shelter: 'Rabbit House', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=500' },
  { id: 6, name: 'Rocky', type: 'Anjing', breed: 'Kintamani Mix', age: '5 Tahun', gender: 'Jantan', location: 'Nusa Dua', tags: ['Vaksin', 'Steril', 'Sehat'], shelter: 'Shelter Harapan Hewan', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500' },
];

const AdoptionContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  
  // State manajemen pop-up modal adopsi
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalStage, setModalStage] = useState(''); // 'detail', 'form', 'success'

  const categories = ['Semua', 'Anjing', 'Kucing', 'Kelinci'];

  const filteredPets = DUMMY_PETS.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'Semua' || pet.type === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (pet) => {
    setSelectedPet(pet);
    setModalStage('detail');
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
    setModalStage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins pb-16">
      <div className="bg-brand-blue-light border-b border-brand-blue-light mb-8 pt-8 pb-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-2 text-brand-blue-dark">
            <h1 className="text-3xl font-extrabold tracking-tight">Katalog Adopsi</h1>
          </div>
          <p className="text-sm text-brand-blue-dark mb-6">Temukan sahabat berbulu yang menunggu rumah barumu</p>
          <AdoptionSteps />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Cari nama atau ras hewan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-gray-200/80 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:border-brand-blue-normal focus:ring-1 focus:ring-brand-blue-normal/20 transition-all placeholder:text-gray-400 font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2.5 text-sm font-bold rounded-2xl transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-brand-blue-normal text-white shadow-md shadow-brand-blue-normal/20'
                    : 'bg-white text-gray-500 border border-gray-200/60 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <AdoptionCard 
                key={pet.id} 
                pet={pet} 
                onActionClick={() => handleOpenModal(pet)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium text-sm">Tidak ada hewan peliharaan yang cocok dengan pencarian Anda.</p>
          </div>
        )}
      </div>

      <AdoptionModal 
        isOpen={Boolean(selectedPet)} 
        onClose={handleCloseModal} 
        pet={selectedPet}
        currentStage={modalStage} 
      >
        {modalStage === 'detail' && (
          <PetDetailStage 
            pet={selectedPet} 
            onNext={() => setModalStage('form')} 
          />
        )}
        {modalStage === 'form' && (
          <PetFormStage 
            pet={selectedPet} 
            onBack={() => setModalStage('detail')} 
            onSubmit={() => 
              {setModalStage('success');
            }} 
          />
        )}
        {modalStage === 'success' && (
          <PetSuccessStage 
            onClose={handleCloseModal} 
          />
        )}
      </AdoptionModal>
    </div>
  );
};

export default AdoptionContainer;