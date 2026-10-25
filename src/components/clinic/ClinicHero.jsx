import clinicHeroImage from "../../assets/clinic/clinic-hero.png";

export default function ClinicHero() {
  return (
    <section className="bg-brand-blue-light py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="mt-5 max-w-2xl text-3xl leading-tight font-extrabold font-poppins tracking-tight text-slate-900 md:text-5xl">
              Perawatan terbaik, di klinik pilihanmu.
            </h1>

            <p className="mt-6 max-w-2xl text-sm md:text-lg leading-7 text-brand-blue-normal font-poppins md:text-base">
              Temukan klinik mitra untuk Pet Hospitalization dan Pet Boarding.
              Pilih lokasi, cek kapasitas sesuai tanggal, lalu ajukan reservasi
              dalam satu tempat.
            </p>

            <a
              href="#direktori"
              className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-xl bg-brand-blue-normal px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
            >
              Temukan klinik mitra
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src={clinicHeroImage}
              alt="Gambar ilustrasi klinik hewan"
              className="h-full min-h-64 w-full object-cover md:min-h-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
}