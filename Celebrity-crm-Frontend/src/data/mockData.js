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
    id: 201,
    title: 'Summer Fashion 2026',
    brand: 'Vogue Haute Couture',
    celebrity: 'Nayanthara',
    budget: '$120,000',
    status: 'Ongoing',
    progress: 65,
    deadline: '15 Jan 2026',
    reach: '14.2M Impressions'
  },
  {
    id: 202,
    title: 'Velocity Electric Superbike',
    brand: 'Apex Motors EV',
    celebrity: 'Ajith Kumar',
    budget: '$250,000',
    status: 'Ongoing',
    progress: 40,
    deadline: '28 Feb 2026',
    reach: '22.8M Impressions'
  },
  {
    id: 203,
    title: 'Global Luxury Chrono Watch',
    brand: 'Chrono Elite Swiss',
    celebrity: 'Vijay',
    budget: '$320,000',
    status: 'Completed',
    progress: 100,
    deadline: '10 Nov 2025',
    reach: '38.5M Impressions'
  },
  {
    id: 204,
    title: 'Monsoon Pure Aqua Campaign',
    brand: 'AquaPure Beverages',
    celebrity: 'Suriya',
    budget: '$180,000',
    status: 'Planned',
    progress: 20,
    deadline: '20 Mar 2026',
    reach: '11.0M Impressions'
  },
  {
    id: 205,
    title: 'Sound of Thunder World Tour',
    brand: 'SonicMaster Global',
    celebrity: 'Anirudh Ravichander',
    budget: '$350,000',
    status: 'Ongoing',
    progress: 80,
    deadline: '30 Dec 2025',
    reach: '45.0M Impressions'
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
    id: 1,
    name: 'John Doe',
    title: 'Senior VP of Talent',
    agency: 'Elite Talent Management',
    email: 'john.doe@celebrityagency.com',
    phone: '+1-555-0199',
    assignedCelebrities: ['Vijay', 'Anirudh Ravichander'],
    status: 'Active'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    title: 'Director of Brand Endorsements',
    agency: 'Global Talent & Media',
    email: 'sarah.j@globaltalent.com',
    phone: '+1-555-0245',
    assignedCelebrities: ['Nayanthara', 'Trisha'],
    status: 'Active'
  },
  {
    id: 3,
    name: 'Vikram Rathore',
    title: 'Executive Talent Producer',
    agency: 'Apex Studio Representations',
    email: 'vikram.r@apexstudio.in',
    phone: '+91 98200 45678',
    assignedCelebrities: ['Ajith Kumar', 'Suriya'],
    status: 'Active'
  },
  {
    id: 4,
    name: 'Priya Sunder',
    title: 'Casting & Contract Relations Head',
    agency: 'Zenve Talent Network',
    email: 'priya.s@zenvetalent.com',
    phone: '+91 98450 11223',
    assignedCelebrities: ['Dhanush', 'Samantha Ruth Prabhu'],
    status: 'Active'
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

