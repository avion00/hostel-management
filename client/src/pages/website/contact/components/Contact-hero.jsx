const ContactHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Get in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {" "}
              Touch
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Have questions? Need help? Our dedicated support team is here to
            assist you 24/7. Reach out to us through any of the channels below.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
