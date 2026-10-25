import ClinicCard from '../../components/clinic/ClinicCard';
import ClinicHero from '../../components/clinic/ClinicHero';

export default function Clinic() {
  // Contoh data dummy klinik dari desain
  const clinics = [
    {
      name: "Klinik Satwa Medika",
      image: "https://via.placeholder.com/400x250",
      location: "Renon, Denpasar",
      distance: "2,4 km",
      hours: "08.00-20.00 WITA",
      hospitalization: "3 dari 8 tempat",
      boarding: "5 dari 12 tempat",
      price: "Rp150.000 / malam"
    },
    {
      name: "Bali Pet Care",
      image: "https://via.placeholder.com/400x250",
      location: "Sanur, Denpasar",
      distance: "5,1 km",
      hours: "09.00-21.00 WITA",
      hospitalization: "2 dari 6 tempat",
      boarding: "2 dari 10 tempat",
      price: "Rp175.000 / malam"
    },
    {
      name: "Ubud Animal Wellness",
      image: "https://via.placeholder.com/400x250",
      location: "Ubud, Gianyar",
      distance: "24 km",
      hours: "08.00-18.00 WITA",
      hospitalization: "Penuh • 0 dari 4",
      boarding: "4 dari 8 tempat",
      price: "Rp160.000 / malam"
    }
  ];

  return (
    <main>
      <ClinicHero>
        
      </ClinicHero>
    </main>
  );
}