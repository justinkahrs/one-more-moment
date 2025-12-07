export interface Event {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  isUpcoming: boolean;
}

export const events: Event[] = [
  {
    slug: "wish-fulfillment-workshop",
    title: "Wish Fulfillment Workshop",
    date: "May 28, 2024",
    time: "10:00 AM – 1:00 PM",
    location: "Community Center, 123 Main St. Cityville",
    description:
      "Work directly with our team to help process and fulfill pending wishes. Offer training and collaboration on creating meaningful experiences for participants.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    isUpcoming: true,
  },
  {
    slug: "fundraiser-planning",
    title: "Fundraiser Planning Meeting",
    date: "April 20, 2024",
    time: "2:00 PM – 4:00 PM",
    location: "Online (Zoom)",
    description:
      "Join the committee to plan our annual summer gala. creative ideas welcome!",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    isUpcoming: false,
  },
  {
    slug: "support-training",
    title: "In-Person Support Training",
    date: "April 8, 2024",
    time: "9:00 AM – 5:00 PM",
    location: "Headquarters, Room 302",
    description:
      "Comprehensive training for volunteers interested in direct family support roles.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    isUpcoming: false,
  },
  {
    slug: "community-outreach",
    title: "Community Outreach Day",
    date: "March 16, 2024",
    time: "8:00 AM – 12:00 PM",
    location: "City Park",
    description:
      "Help us spread the word about our mission at the local community fair.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    isUpcoming: false,
  },
];
