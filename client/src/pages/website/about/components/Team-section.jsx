import React from "react";
import { Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const team = [
  {
    name: "Arjun Sharma",
    role: "CEO & Co-Founder",
    bio: "Former McKinsey consultant with 10+ years in PropTech. IIT Delhi alumnus passionate about solving student housing challenges.",
    image: "https://randomuser.me/api/portraits/men/25.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Priya Patel",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer with expertise in scalable systems. MIT graduate focused on building technology that matters.",
    image: "https://randomuser.me/api/portraits/women/76.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Rahul Kumar",
    role: "Head of Operations",
    bio: "Operations expert with 8+ years in hospitality. Ensures seamless experience for students and partners.",
    image: "https://randomuser.me/api/portraits/men/84.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sneha Gupta",
    role: "Head of Marketing",
    bio: "Brand strategist with experience at leading startups. Passionate about connecting with the student community.",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    linkedin: "#",
    twitter: "#",
  },
];

const TeamSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            The passionate individuals working to make student accommodation
            better for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-square relative">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={member.image || "/placeholder.svg"}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none text-2xl">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex space-x-3">
                  <Link href={member.linkedin}>
                    <Linkedin className="w-5 h-5 text-slate-400 hover:text-indigo-600 transition-colors" />
                  </Link>
                  <Link href={member.twitter}>
                    <Twitter className="w-5 h-5 text-slate-400 hover:text-indigo-600 transition-colors" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
