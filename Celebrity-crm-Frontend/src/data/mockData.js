import { getManagerPhoto } from './managerPhotos';
// Initial mock data for Zenve CRM Portal

export const initialCelebrities = [
  {
    id: 1,
    name: 'Vijay',
    category: 'Actor / Superstar',
    campaignsCount: 5,
    status: 'Active',
    rating: 99,
    location: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'mgmt@vijayfilms.com',
    phone: '+91 98401 23456',
    activeContract: '$320,000 / yr',
    followers: '24.5M'
  },
  {
    id: 2,
    name: 'Nayanthara',
    category: 'Actress / Superstar',
    campaignsCount: 4,
    status: 'Active',
    rating: 97,
    location: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'contact@ladyqueen.in',
    phone: '+91 98402 34567',
    activeContract: '$240,000 / yr',
    followers: '18.2M'
  },
  {
    id: 3,
    name: 'Suriya',
    category: 'Actor / Producer',
    campaignsCount: 3,
    status: 'Active',
    rating: 96,
    location: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'team@2dentertainment.com',
    phone: '+91 98403 45678',
    activeContract: '$210,000 / yr',
    followers: '15.9M'
  },
  {
    id: 4,
    name: 'Ajith Kumar',
    category: 'Actor / Racer',
    campaignsCount: 3,
    status: 'Active',
    rating: 98,
    location: 'Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'racing@ajithoffice.com',
    phone: '+91 98404 56789',
    activeContract: '$280,000 / yr',
    followers: '19.4M'
  },
  {
    id: 5,
    name: 'Trisha',
    category: 'Actress / Icon',
    campaignsCount: 2,
    status: 'Active',
    rating: 95,
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    email: 'pr@trishakrish.com',
    phone: '+91 98405 67890',
    activeContract: '$180,000 / yr',
    followers: '12.8M'
  },
  {
    id: 6,
    name: 'Dhanush',
    category: 'Actor / Director',
    campaignsCount: 2,
    status: 'On Hold',
    rating: 96,
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    email: 'wunderbar@dhanush.in',
    phone: '+91 98406 78901',
    activeContract: '$220,000 / yr',
    followers: '16.7M'
  },
  {
    id: 7,
    name: 'Anirudh Ravichander',
    category: 'Music Composer / Rock Star',
    campaignsCount: 4,
    status: 'Active',
    rating: 99,
    location: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    email: 'rock@anirudhmusic.com',
    phone: '+91 98407 89012',
    activeContract: '$350,000 / yr',
    followers: '21.3M'
  },
  {
    id: 8,
    name: 'Samantha Ruth Prabhu',
    category: 'Actress / Brand Icon',
    campaignsCount: 2,
    status: 'Active',
    rating: 94,
    location: 'Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'mgmt@samanthaofficial.com',
    phone: '+91 98408 90123',
    activeContract: '$195,000 / yr',
    followers: '17.6M'
  }
];

export const initialShoots = [
  {
    id: 101,
    date: '28 Nov 2025',
    rawDate: '2025-11-28',
    title: 'Brand Photoshoot',
    celebrity: 'Vijay',
    celebrityAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Chennai Studio 4',
    status: 'Scheduled',
    time: '09:00 AM - 05:00 PM',
    director: 'Gautham Menon'
  },
  {
    id: 102,
    date: '29 Nov 2025',
    rawDate: '2025-11-29',
    title: 'Movie Scene Shoot',
    celebrity: 'Trisha',
    celebrityAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    location: 'Hyderabad Film City',
    status: 'Scheduled',
    time: '07:00 AM - 04:00 PM',
    director: 'Mani Ratnam'
  },
  {
    id: 103,
    date: '02 Dec 2025',
    rawDate: '2025-12-02',
    title: 'Ad Film Commercial',
    celebrity: 'Suriya',
    celebrityAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'Mumbai Mehboob Studio',
    status: 'Confirmed',
    time: '10:00 AM - 06:00 PM',
    director: 'Rajkumar Hirani'
  },
  {
    id: 104,
    date: '05 Dec 2025',
    rawDate: '2025-12-05',
    title: 'Music Video Production',
    celebrity: 'Dhanush',
    celebrityAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    location: 'Chennai East Coast',
    status: 'Planned',
    time: '08:00 AM - 07:00 PM',
    director: 'Karthik Subbaraj'
  },
  {
    id: 105,
    date: '08 Dec 2025',
    rawDate: '2025-12-08',
    title: 'Web Series Shoot',
    celebrity: 'Nayanthara',
    celebrityAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'Bangalore Palace',
    status: 'Planned',
    time: '06:30 AM - 03:00 PM',
    director: 'Vignesh Shivan'
  },
  {
    id: 106,
    date: '12 Dec 2025',
    rawDate: '2025-12-12',
    title: 'EV Superbike TV Commercial',
    celebrity: 'Ajith Kumar',
    celebrityAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    location: 'Dubai Autodrome Circuit',
    status: 'Confirmed',
    time: '08:00 AM - 05:00 PM',
    director: 'H. Vinoth'
  }
];

export const initialCampaigns = [
  {
      "id": 201,
      "title": "Summer Fashion 2026",
      "brand": "Vogue Haute Couture",
      "celebrity": "Nayanthara",
      "budget": "$120,000",
      "status": "Ongoing",
      "progress": 65,
      "deadline": "15 Jan 2026",
      "reach": "14.2M Impressions"
  },
  {
      "id": 202,
      "title": "Velocity Electric Superbike",
      "brand": "Apex Motors EV",
      "celebrity": "Ajith Kumar",
      "budget": "$250,000",
      "status": "Ongoing",
      "progress": 40,
      "deadline": "28 Feb 2026",
      "reach": "22.8M Impressions"
  },
  {
      "id": 203,
      "title": "Global Luxury Chrono Watch",
      "brand": "Chrono Elite Swiss",
      "celebrity": "Vijay",
      "budget": "$320,000",
      "status": "Completed",
      "progress": 100,
      "deadline": "10 Nov 2025",
      "reach": "38.5M Impressions"
  },
  {
      "id": 204,
      "title": "Monsoon Pure Aqua Campaign",
      "brand": "AquaPure Beverages",
      "celebrity": "Suriya",
      "budget": "$180,000",
      "status": "Planned",
      "progress": 20,
      "deadline": "20 Mar 2026",
      "reach": "11.0M Impressions"
  },
  {
      "id": 205,
      "title": "Sound of Thunder World Tour",
      "brand": "SonicMaster Global",
      "celebrity": "Anirudh Ravichander",
      "budget": "$350,000",
      "status": "Ongoing",
      "progress": 80,
      "deadline": "30 Dec 2025",
      "reach": "45.0M Impressions"
  },
  {
      "id": 206,
      "title": "Royal Heritage Jewelry Gala",
      "brand": "Tanishq Imperial Jewels",
      "celebrity": "Trisha",
      "budget": "$210,000",
      "status": "Ongoing",
      "progress": 75,
      "deadline": "18 Apr 2026",
      "reach": "18.6M Impressions"
  },
  {
      "id": 207,
      "title": "Urban Streetwear & Denim Campaign",
      "brand": "Leviathan Denim Works",
      "celebrity": "Dhanush",
      "budget": "$195,000",
      "status": "Planned",
      "progress": 15,
      "deadline": "10 May 2026",
      "reach": "16.4M Impressions"
  },
  {
      "id": 208,
      "title": "Glow Botanical Skincare Series",
      "brand": "Kiehl’s Apothecary Naturals",
      "celebrity": "Samantha Ruth Prabhu",
      "budget": "$275,000",
      "status": "Ongoing",
      "progress": 55,
      "deadline": "25 Mar 2026",
      "reach": "24.1M Impressions"
  },
  {
      "id": 209,
      "title": "Titanium Ultra Smartphone Pro",
      "brand": "NovaTech Global Electronics",
      "celebrity": "Vijay",
      "budget": "$420,000",
      "status": "Planned",
      "progress": 10,
      "deadline": "12 Jun 2026",
      "reach": "52.0M Impressions"
  },
  {
      "id": 210,
      "title": "Signature Perfume & Fragrance Ad",
      "brand": "Maison De Luxe Paris",
      "celebrity": "Nayanthara",
      "budget": "$230,000",
      "status": "Completed",
      "progress": 100,
      "deadline": "05 Jan 2026",
      "reach": "31.5M Impressions"
  }
];

export const initialContracts = [
  {
    id: 'CNT-2025-001',
    celebrity: 'Vijay',
    client: 'Chrono Elite Swiss',
    value: '$320,000',
    duration: '24 Months',
    status: 'Active',
    signedDate: '15 Jan 2025',
    expiryDate: '14 Jan 2027',
    category: 'Brand Endorsement'
  },
  {
    id: 'CNT-2025-002',
    celebrity: 'Nayanthara',
    client: 'Vogue Haute Couture',
    value: '$120,000',
    duration: '12 Months',
    status: 'Active',
    signedDate: '01 Mar 2025',
    expiryDate: '28 Feb 2026',
    category: 'Fashion Ambassador'
  },
  {
    id: 'CNT-2025-003',
    celebrity: 'Ajith Kumar',
    client: 'Apex Motors EV',
    value: '$250,000',
    duration: '18 Months',
    status: 'Active',
    signedDate: '10 May 2025',
    expiryDate: '09 Nov 2026',
    category: 'Motorsport Brand Lead'
  },
  {
    id: 'CNT-2025-004',
    celebrity: 'Suriya',
    client: 'AquaPure Global',
    value: '$180,000',
    duration: '12 Months',
    status: 'Drafting',
    signedDate: 'Pending',
    expiryDate: 'Pending',
    category: 'TV & Digital Ad'
  },
  {
    id: 'CNT-2025-005',
    celebrity: 'Anirudh Ravichander',
    client: 'SonicMaster Studio',
    value: '$350,000',
    duration: '36 Months',
    status: 'Active',
    signedDate: '05 Jan 2025',
    expiryDate: '04 Jan 2028',
    category: 'Music Endorsement'
  }
];

export const initialManagers = [
  {
      "id": 1,
      "name": "John Doe",
      "role": "Senior VP of Talent",
      "title": "Senior VP of Talent",
      "agency": "Elite Talent Management",
      "email": "john.doe@celebrityagency.com",
      "phone": "+1-555-0199",
      "photo": "/images/managers/1.jpg",
      "avatar": "/images/managers/1.jpg",
      "representedTalents": [
          "Vijay",
          "Anirudh Ravichander"
      ],
      "assignedCelebrities": [
          "Vijay",
          "Anirudh Ravichander"
      ],
      "status": "Active"
  },
  {
      "id": 2,
      "name": "Sarah Jenkins",
      "role": "Director of Brand Endorsements",
      "title": "Director of Brand Endorsements",
      "agency": "Global Talent & Media",
      "email": "sarah.j@globaltalent.com",
      "phone": "+1-555-0245",
      "photo": "/images/managers/2.jpg",
      "avatar": "/images/managers/2.jpg",
      "representedTalents": [
          "Nayanthara",
          "Trisha"
      ],
      "assignedCelebrities": [
          "Nayanthara",
          "Trisha"
      ],
      "status": "Active"
  },
  {
      "id": 3,
      "name": "Vikram Rathore",
      "role": "Executive Talent Producer",
      "title": "Executive Talent Producer",
      "agency": "Apex Studio Representations",
      "email": "vikram.r@apexstudio.in",
      "phone": "+91 98200 45678",
      "photo": "/images/managers/3.jpg",
      "avatar": "/images/managers/3.jpg",
      "representedTalents": [
          "Ajith Kumar",
          "Suriya"
      ],
      "assignedCelebrities": [
          "Ajith Kumar",
          "Suriya"
      ],
      "status": "Active"
  },
  {
      "id": 4,
      "name": "Priya Sunder",
      "role": "Casting & Contract Relations Head",
      "title": "Casting & Contract Relations Head",
      "agency": "Zenve Talent Network",
      "email": "priya.s@zenvetalent.com",
      "phone": "+91 98450 11223",
      "photo": "/images/managers/4.jpg",
      "avatar": "/images/managers/4.jpg",
      "representedTalents": [
          "Dhanush",
          "Samantha Ruth Prabhu"
      ],
      "assignedCelebrities": [
          "Dhanush",
          "Samantha Ruth Prabhu"
      ],
      "status": "Active"
  },
  {
      "id": 5,
      "name": "Arjun Verma",
      "role": "VP of Brand Alliances & Partnerships",
      "title": "VP of Brand Alliances & Partnerships",
      "agency": "Apex Studio Representations",
      "email": "arjun.v@apexstudio.in",
      "phone": "+91 98201 55670",
      "photo": "/images/managers/5.jpg",
      "avatar": "/images/managers/5.jpg",
      "representedTalents": [
          "Vijay",
          "Suriya"
      ],
      "assignedCelebrities": [
          "Vijay",
          "Suriya"
      ],
      "status": "Active"
  },
  {
      "id": 6,
      "name": "Ananya Sen",
      "role": "Head of Artist Endorsements & OTT",
      "title": "Head of Artist Endorsements & OTT",
      "agency": "Global Talent & Media",
      "email": "ananya.sen@globaltalent.in",
      "phone": "+91 98112 33445",
      "photo": "/images/managers/6.jpg",
      "avatar": "/images/managers/6.jpg",
      "representedTalents": [
          "Nayanthara",
          "Samantha Ruth Prabhu"
      ],
      "assignedCelebrities": [
          "Nayanthara",
          "Samantha Ruth Prabhu"
      ],
      "status": "Active"
  },
  {
      "id": 7,
      "name": "Rohan Mehta",
      "role": "Executive Director of Talent Booking",
      "title": "Executive Director of Talent Booking",
      "agency": "Elite Talent Management",
      "email": "rohan.m@elitetalent.com",
      "phone": "+91 22 2640 9911",
      "photo": "/images/managers/7.jpg",
      "avatar": "/images/managers/7.jpg",
      "representedTalents": [
          "Ajith Kumar",
          "Anirudh Ravichander"
      ],
      "assignedCelebrities": [
          "Ajith Kumar",
          "Anirudh Ravichander"
      ],
      "status": "Active"
  },
  {
      "id": 8,
      "name": "Meera Nambiar",
      "role": "Music & Performing Arts Liaison",
      "title": "Music & Performing Arts Liaison",
      "agency": "Zenve Talent Network",
      "email": "meera.n@zenvetalent.com",
      "phone": "+91 80 4123 8899",
      "photo": "/images/managers/8.jpg",
      "avatar": "/images/managers/8.jpg",
      "representedTalents": [
          "Anirudh Ravichander",
          "Trisha"
      ],
      "assignedCelebrities": [
          "Anirudh Ravichander",
          "Trisha"
      ],
      "status": "Active"
  },
  {
      "id": 9,
      "name": "Kavita Krishnan",
      "role": "Chief Casting Director & Talent Strategist",
      "title": "Chief Casting Director & Talent Strategist",
      "agency": "Elite Talent Management",
      "email": "kavita.k@elitetalent.com",
      "phone": "+91 22 2640 7722",
      "photo": "/images/managers/9.jpg",
      "avatar": "/images/managers/9.jpg",
      "representedTalents": [
          "Vijay",
          "Trisha"
      ],
      "assignedCelebrities": [
          "Vijay",
          "Trisha"
      ],
      "status": "Active"
  },
  {
      "id": 10,
      "name": "Devendra Singhania",
      "role": "Global Commercial Brand Agent",
      "title": "Global Commercial Brand Agent",
      "agency": "Apex Studio Representations",
      "email": "devendra.s@apexstudio.in",
      "phone": "+91 98203 88990",
      "photo": "/images/managers/10.jpg",
      "avatar": "/images/managers/10.jpg",
      "representedTalents": [
          "Suriya",
          "Dhanush"
      ],
      "assignedCelebrities": [
          "Suriya",
          "Dhanush"
      ],
      "status": "Active"
  },
  {
      "id": 11,
      "name": "Tara Alagappan",
      "role": "International Media & PR Director",
      "title": "International Media & PR Director",
      "agency": "Global Talent & Media",
      "email": "tara.a@globaltalent.in",
      "phone": "+91 44 2811 7700",
      "photo": "/images/managers/11.jpg",
      "avatar": "/images/managers/11.jpg",
      "representedTalents": [
          "Nayanthara",
          "Ajith Kumar"
      ],
      "assignedCelebrities": [
          "Nayanthara",
          "Ajith Kumar"
      ],
      "status": "Active"
  },
  {
      "id": 12,
      "name": "Karthik Sundaram",
      "role": "Digital Influencer & OTT Contract Head",
      "title": "Digital Influencer & OTT Contract Head",
      "agency": "Zenve Talent Network",
      "email": "karthik.s@zenvetalent.com",
      "phone": "+91 80 4123 9933",
      "photo": "/images/managers/12.jpg",
      "avatar": "/images/managers/12.jpg",
      "representedTalents": [
          "Samantha Ruth Prabhu",
          "Anirudh Ravichander"
      ],
      "assignedCelebrities": [
          "Samantha Ruth Prabhu",
          "Anirudh Ravichander"
      ],
      "status": "Active"
  },
  {
      "id": 13,
      "name": "Rhea Chawla",
      "role": "Senior VP of Endorsement Strategy",
      "title": "Senior VP of Endorsement Strategy",
      "agency": "Elite Talent Management",
      "email": "rhea.c@elitetalent.com",
      "phone": "+91 22 2640 4455",
      "photo": "/images/managers/13.jpg",
      "avatar": "/images/managers/13.jpg",
      "representedTalents": [
          "Nayanthara",
          "Vijay"
      ],
      "assignedCelebrities": [
          "Nayanthara",
          "Vijay"
      ],
      "status": "Active"
  },
  {
      "id": 14,
      "name": "Siddharth Roy",
      "role": "Lead Production Coordinator & Talent Escort",
      "title": "Lead Production Coordinator & Talent Escort",
      "agency": "Apex Studio Representations",
      "email": "siddharth.r@apexstudio.in",
      "phone": "+91 98205 66778",
      "photo": "/images/managers/14.jpg",
      "avatar": "/images/managers/14.jpg",
      "representedTalents": [
          "Ajith Kumar",
          "Dhanush"
      ],
      "assignedCelebrities": [
          "Ajith Kumar",
          "Dhanush"
      ],
      "status": "Active"
  }
];

export const initialActivities = [
  {
    id: 1,
    type: 'contract',
    title: 'New contract created for Vijay',
    desc: 'Contract #CNT-2025-001 with Chrono Elite Swiss',
    time: '2 hours ago',
    iconColor: '#6366F1'
  },
  {
    id: 2,
    type: 'campaign',
    title: 'Campaign updated: Summer Fashion',
    desc: 'Status changed to Ongoing (65% deliverables completed)',
    time: '4 hours ago',
    iconColor: '#10B981'
  },
  {
    id: 3,
    type: 'casting',
    title: 'New casting application received',
    desc: 'Ronit Sharma submitted portfolio for Lead Actor in OTT thriller',
    time: '6 hours ago',
    iconColor: '#8B5CF6'
  },
  {
    id: 4,
    type: 'shoot',
    title: 'Shoot scheduled: Ad Film Shoot',
    desc: 'Confirmed at Chennai Studio 4, 28 Nov 2025 with Vijay',
    time: '8 hours ago',
    iconColor: '#EC4899'
  },
  {
    id: 5,
    type: 'profile',
    title: 'Profile updated by Nayanthara',
    desc: 'Updated portfolio imagery and high-res brand stills',
    time: '10 hours ago',
    iconColor: '#F59E0B'
  },
  {
    id: 6,
    type: 'payment',
    title: 'Milestone payment released',
    desc: '$125,000 received for Apex EV Superbike shoot phase 1',
    time: '1 day ago',
    iconColor: '#06B6D4'
  }
];

export const monthlyPerformanceData = [
  { month: 'Jun', completed: 2, ongoing: 5, planned: 5 },
  { month: 'Jul', completed: 4, ongoing: 6, planned: 3 },
  { month: 'Aug', completed: 5, ongoing: 7, planned: 4 },
  { month: 'Sep', completed: 6, ongoing: 4, planned: 6 },
  { month: 'Oct', completed: 7, ongoing: 6, planned: 6 },
  { month: 'Nov', completed: 6, ongoing: 8, planned: 7 }
];

export const celebrityStatusData = [
  { label: 'Active', count: 18, percentage: '75%', color: '#10B981' },
  { label: 'On Hold', count: 3, percentage: '12.5%', color: '#F59E0B' },
  { label: 'Inactive', count: 2, percentage: '8.3%', color: '#EF4444' },
  { label: 'Pending', count: 1, percentage: '4.2%', color: '#8B5CF6' }
];

export const moduleOverviewCards = [
  { name: 'Celebrities', count: '24 Total', link: '/celebrities', color: '#6366F1', icon: 'Users' },
  { name: 'Managers', count: '6 Total', link: '/managers', color: '#06B6D4', icon: 'UserCheck' },
  { name: 'Agencies', count: '4 Total', link: '/managers', color: '#10B981', icon: 'Building2' },
  { name: 'Contracts', count: '15 Total', link: '/contracts', color: '#F59E0B', icon: 'FileText' },
  { name: 'Campaigns', count: '8 Active', link: '/campaigns', color: '#EC4899', icon: 'Megaphone' },
  { name: 'Shoots', count: '5 Ongoing', link: '/shoots', color: '#14B8A6', icon: 'Camera' },
  { name: 'OTT Projects', count: '3 Total', link: '/campaigns', color: '#8B5CF6', icon: 'Tv' },
  { name: 'Casting Calls', count: '28 Active', link: '/celebrities', color: '#EAB308', icon: 'Sparkles' }
];

