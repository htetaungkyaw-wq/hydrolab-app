export const customersMock = [
  {
    id: '1',
    name: 'Venus Water (Myanmar) Co., Ltd.',
    phone: '09 250 000 465',
    email: 'ops@hydrolab.com',
    address: 'Insein Township, Yangon',
  },
  {
    id: '2',
    name: 'Pan Pacific Yangon',
    phone: '09 795 289 705',
    email: 'engineering@panpac.com',
    address: 'Yangon',
  },
]

export const systemsMock = [
  {
    id: 'sys-1',
    customer: 'Venus Water',
    type: 'Commercial RO Drinking Water Factory',
    flowRate: '3000 L/hr',
    location: 'Yangon',
    installedAt: '2023-06-01',
  },
]

export const ticketsMock = [
  {
    id: 't-1',
    customer: 'Venus Water',
    system: 'Commercial RO Drinking Water Factory',
    status: 'Open',
    subject: 'Low permeate flow',
    updated_at: '2024-04-01',
  },
]
