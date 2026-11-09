export type Service = { id: string; name: string; price: number };

export type CarWash = {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  rating: number;
  opensAt: string;
  closesAt: string;
  services: Service[];
};

const MOCK_WASHES: CarWash[] = [
  {
    id: '1',
    name: 'Sample Car Wash A',
    city: 'Karachi',
    area: 'Gulshan',
    address: 'Sample address, Gulshan, Karachi',
    rating: 4.5,
    opensAt: '9:00 AM',
    closesAt: '8:00 PM',
    services: [
      { id: 's1', name: 'Basic Wash', price: 500 },
      { id: 's2', name: 'Standard Wash', price: 900 },
      { id: 's3', name: 'Interior Cleaning', price: 700 },
    ],
  },
  {
    id: '2',
    name: 'Sample Car Wash B',
    city: 'Karachi',
    area: 'DHA',
    address: 'Sample address, DHA, Karachi',
    rating: 4.2,
    opensAt: '8:00 AM',
    closesAt: '9:00 PM',
    services: [
      { id: 's4', name: 'Basic Wash', price: 600 },
      { id: 's5', name: 'Premium Wash', price: 1500 },
    ],
  },
  {
    id: '3',
    name: 'Sample Car Wash C',
    city: 'Lahore',
    area: 'Gulberg',
    address: 'Sample address, Gulberg, Lahore',
    rating: 4.7,
    opensAt: '9:00 AM',
    closesAt: '7:00 PM',
    services: [
      { id: 's6', name: 'Standard Wash', price: 1000 },
      { id: 's7', name: 'Premium Wash', price: 1800 },
    ],
  },
  {
    id: '4',
    name: 'Sample Car Wash D',
    city: 'Karachi',
    area: 'Clifton',
    address: 'Sample address, Clifton, Karachi',
    rating: 3.9,
    opensAt: '10:00 AM',
    closesAt: '10:00 PM',
    services: [
      { id: 's8', name: 'Basic Wash', price: 450 },
      { id: 's9', name: 'Interior Cleaning', price: 650 },
    ],
  },
  {
    id: '5',
    name: 'Sample Car Wash E',
    city: 'Karachi',
    area: 'Gulshan',
    address: 'Sample address, Gulshan, Karachi',
    rating: 4.8,
    opensAt: '9:00 AM',
    closesAt: '9:00 PM',
    services: [
      { id: 's10', name: 'Standard Wash', price: 1100 },
      { id: 's11', name: 'Premium Wash', price: 2000 },
    ],
  },
];

export async function getCarWashes(city: string): Promise<CarWash[]> {
  return [];
}

export async function login(email: string, password: string) {
  const name = email.split('@')[0];
  return { name: name.charAt(0).toUpperCase() + name.slice(1), email };
}