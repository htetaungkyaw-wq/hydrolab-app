export const projects = [
  {
    title: 'Commercial RO Drinking Water Factory',
    description: 'Turbidity & organic removal, water softening, micron & RO, UV; 3000 L/hr upgradable 6000',
    flow_rate: '3000 → 6000 L/hr',
  },
  {
    title: 'Commercial Boiler Feed Water RO',
    description: 'Turbidity & organic removal, iron reduction, micron & RO; 6000 upgradable 9000',
    flow_rate: '6000 → 9000 L/hr',
  },
  {
    title: 'High-rise condominium treatment',
    description: 'Turbidity & organic removal; 20000',
    flow_rate: '20,000 L/hr',
  },
  {
    title: 'High-rise tower softening',
    description: 'Water softening; 20000',
    flow_rate: '20,000 L/hr',
  },
  {
    title: 'Residential desalination brackish→fresh',
    description: 'Turbidity & organic removal, softening, micron, UF, RO; 1000',
    flow_rate: '1,000 L/hr',
  },
  {
    title: 'Hospital water treatment',
    description: 'Aeration, chlorine oxidation, turbidity & organic removal, iron reduction; 7000',
    flow_rate: '7,000 L/hr',
  },
  {
    title: 'Car spa',
    description: 'Aeration, turbidity & organic removal, iron reduction, micron & UF; 2500',
    flow_rate: '2,500 L/hr',
  },
]

export type Product = {
  title: string
  detail: string
  category?: string
  capacity?: string
  range?: string
}

export const products: Product[] = [
  {
    title: 'UF Systems',
    detail: 'Ultra-filtration trains designed for robust pre-treatment and standalone polishing.',
    category: 'Filtration',
  },
  {
    title: 'IR Series (IR1/IR2/IR3)',
    detail:
      'Removes dissolved iron, odor, color, and sediment with 3–7 step trains sized to iron load and flow rate.',
    category: 'Iron Removal',
  },
]

export const clients = ['Burger King', 'KFC', 'Coca-Cola', 'CP', 'Pan Pacific Yangon', 'Jasmine Ngapali Resort', 'The Ivy', 'Swisscontact']
