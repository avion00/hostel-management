const HomeMapSection = () => {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Explore Hostels Near You
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Interactive map showing verified hostels across major cities. Click
            on markers to view details and availability.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/50">
          <div className="h-96 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54603.00271249818!2d85.28493303870859!3d27.708954252213037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e1!3m2!1sen!2snp!4v1755113102901!5m2!1sen!2snp"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMapSection;
