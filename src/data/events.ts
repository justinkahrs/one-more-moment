import type { ImageMetadata } from 'astro';
import eveOfTheEve2015 from '../assets/events/eve-of-the-eve-2015.jpg';
import giveBackThursday from '../assets/events/give-back-thursday-2016-april.png';
import happyHour2016 from '../assets/events/april-happy-hour-2016.png';
import happyHour2017 from '../assets/events/happy-hour-2017.jpg';
import summerSocial2022 from '../assets/events/summer-social-2022.jpg';

export interface Event {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: ImageMetadata;
  isUpcoming: boolean;
}

export const events: Event[] = [
  {
    slug: "eve-of-the-eve-2015",
    title: "Eve of the Eve",
    date: "December 30, 2015",
    time: "Time TBD",
    location: "Germain Porsche of Ann Arbor, 2575 S State St, Ann Arbor, MI",
    description: "An end-of-year community event supporting One More Moment.",
    image: eveOfTheEve2015,
    isUpcoming: false,
  },
  {
    slug: "give-back-thursday-2016-april",
    title: "Give Back Thursday",
    date: "April 14, 21 & 28, 2016",
    time: "Time TBD",
    location: "Alley Bar, 112 W. Liberty, Ann Arbor, MI",
    description: "April Give Back Thursday nights supporting One More Moment.",
    image: giveBackThursday,
    isUpcoming: false,
  },
  {
    slug: "april-happy-hour-2016",
    title: "Happy Hour",
    date: "April 21, 2016",
    time: "Happy Hour",
    location: "Ruth's Chris Steakhouse, 314 S. Fourth Avenue, Ann Arbor, MI",
    description: "Happy Hour benefiting One More Moment.",
    image: happyHour2016,
    isUpcoming: false,
  },
  {
    slug: "happy-hour-2017",
    title: "Happy Hour (Benefit for One More Moment)",
    date: "March 2, 2017",
    time: "5:00 PM – 8:00 PM",
    location: "The Session Room, 3685 Jackson Rd., Ann Arbor, MI 48103",
    description:
      "Happy Hour benefiting One More Moment for late-stage cancer warriors.",
    image: happyHour2017,
    isUpcoming: false,
  },
  {
    slug: "summer-social-2022",
    title: "Summer Social",
    date: "June 16, 2022",
    time: "6:00 PM – 10:00 PM",
    location:
      "Watermark Country Club, 1600 Galbraith Ave SE, Grand Rapids, MI 49546",
    description:
      "Summer Social benefiting One More Moment with drinks, music, prizes, and giveaways.",
    image: summerSocial2022,
    isUpcoming: true,
  },
];