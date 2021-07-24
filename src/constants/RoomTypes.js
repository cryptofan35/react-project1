export const RoomTypes = {
  1: {
    code: 1,
    name: 'Apartment',
    stdOccupancy: 2
  },
  5: {
    code: 5,
    name: 'Double bedroom',
    stdOccupancy: 2,
  },
  6: {
    code: 6,
    name: 'Three bedroom',
    stdOccupancy: 3,
  },
  7: {
    code: 7,
    name: 'Single bedroom',
    stdOccupancy: 1
  },
  10: {
    code: 10,
    name: 'Five bedroom',
    stdOccupancy: 5
  },
  12: {
    code: 12,
    name: 'Eight bedroom',
    stdOccupancy: 8
  },
  13: {
    code: 13,
    name: 'Junior suite',
    stdOccupancy: 2
  },
  14: {
    code: 14,
    name: 'Duplex',
    stdOccupancy: 2
  },
  15: {
    code: 15,
    name: 'Penthouse',
    stdOccupancy: 2
  },
  17: {
    code: 17,
    name: 'Studio',
    stdOccupancy: 2
  },
  18: {
    code: 18,
    name: 'Suite',
    stdOccupancy: 2
  },
  19: {
    code: 19,
    name: 'Four Bedroom',
    stdOccupancy: 4
  },
  21: {
    code: 21,
    name: 'Twin room',
    stdOccupancy: 2
  },
  23: {
    code: 23,
    name: 'Room with six beds',
    stdOccupancy: 6
  },
  24: {
    code: 24,
    name: 'Room with seven beds',
    stdOccupancy: 7
  },
  25: {
    code: 25,
    name: 'Nine bedroom',
    stdOccupancy: 9
  },
  27: {
    code: 27,
    name: 'Ten bedroom',
    stdOccupancy: 10
  },
  29: {
    code: 29,
    name: 'Twelve bedroom',
    stdOccupancy: 12
  },
  30: {
    code: 30,
    name: 'Bed in Dormitory',
    stdOccupancy: 1
  },
  38: {
    code: 38,
    name: 'NonRoomUnlimited',
    stdOccupancy: 100
  },
  60: {
    code: 60,
    name: 'Pitch',
    stdOccupancy: 1
  },
  99: {
    code: 99,
    name: 'Default Room',
    stdOccupancy: 99
  }
};

export const RoomTypesAsArray = Object.keys(RoomTypes).map((code) => RoomTypes[code]);
