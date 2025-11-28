const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Our Impact
          </h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Numbers that speak for our success and yours
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { number: "10,000+", label: "Partner Properties" },
            { number: "50,000+", label: "Happy Students" },
            { number: "95%", label: "Average Occupancy" },
            { number: "₹2Cr+", label: "Revenue Generated" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-indigo-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
