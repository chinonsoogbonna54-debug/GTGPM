import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import logo from "../assets/logo.jpg";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-[630px] mx-auto pb-24 px-4">
        <section className="mt-6 text-center">
          <img src={logo} alt="GTGPM logo" className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-brand-red" />
          <h1 className="font-serif text-2xl mt-3">Glory To God Power Ministries International</h1>
          <p className="text-sm mt-1 text-brand-grey">
            Chief Efam Ijeh Street, Owa Aliosimi, after Owanta Secondary School, Agbor, Delta State
          </p>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl border border-brand-line p-4">
            <p className="text-[11px] uppercase tracking-wide text-brand-grey">Founded</p>
            <p className="font-serif text-lg mt-1">Oct 17, 2020</p>
          </div>
          <div className="rounded-xl border border-brand-line p-4">
            <p className="text-[11px] uppercase tracking-wide text-brand-grey">Service Times</p>
            <p className="text-sm mt-1">Sun 8am · Wed 10am</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl mb-2">Our Mission</h2>
          <p className="text-[15px] leading-relaxed text-brand-grey">
            To carry the light and power of the Gospel to every household in our community, raising a people
            shaped by prayer, the Word, and genuine fellowship.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl mb-2">Our Vision</h2>
          <p className="text-[15px] leading-relaxed text-brand-grey">
            A church without walls — reaching the next generation online as faithfully as we do from the
            pulpit.
          </p>
        </section>

        <section className="mt-8 mb-12">
          <h2 className="font-serif text-xl mb-3">Leadership</h2>
          {/* Placeholder cards — swap in real photos and names once provided */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl border-2 border-dashed border-brand-line flex items-center justify-center">
                <span className="text-xs text-brand-grey">
                  Pastor photo
                  <br />
                  coming soon
                </span>
              </div>
              <p className="text-sm font-medium mt-2">Name pending</p>
              <p className="text-xs text-brand-grey">Senior Pastor</p>
            </div>
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl border-2 border-dashed border-brand-line flex items-center justify-center">
                <span className="text-xs text-brand-grey">
                  Pastor photo
                  <br />
                  coming soon
                </span>
              </div>
              <p className="text-sm font-medium mt-2">Name pending</p>
              <p className="text-xs text-brand-grey">Associate Pastor</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
