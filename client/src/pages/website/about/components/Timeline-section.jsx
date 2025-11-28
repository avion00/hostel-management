const milestones = [
  {
    year: "2020",
    title: "Founded HostelHub",
    description:
      "Started with a vision to simplify student accommodation search in Delhi.",
  },
  {
    year: "2021",
    title: "Expanded to 5 Cities",
    description:
      "Grew to Mumbai, Bangalore, Pune, and Chennai with 1,000+ properties.",
  },
  {
    year: "2022",
    title: "Series A Funding",
    description:
      "Raised $10M to accelerate growth and enhance platform features.",
  },
  {
    year: "2023",
    title: "50,000 Students",
    description: "Reached milestone of serving 50,000+ students across India.",
  },
  {
    year: "2024",
    title: "AI-Powered Matching",
    description:
      "Launched intelligent matching system for better student-property fit.",
  },
];

const TimelineSection = () => {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Our Journey
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Key milestones in our mission to transform student accommodation in
            India.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="ml-8 flex-1">
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200/50">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-indigo-600">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
