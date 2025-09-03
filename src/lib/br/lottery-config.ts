export const lotteries = [
  { id: "PPT", name: "PPT-RJ", time: "09:30", fullName: "Primera del Día" },
  { id: "PTM", name: "PTM-RJ", time: "11:30", fullName: "Primera de la Mañana" },
  { id: "PT", name: "PT-RJ", time: "14:30", fullName: "Primera de la Tarde" },
  { id: "PTV", name: "PTV-RJ", time: "16:30", fullName: "Primera de la Vespertina" },
  { id: "PTN", name: "PTN-RJ", time: "18:30", fullName: "Primera de la Noche" },
  { id: "COR", name: "COR-RJ", time: "21:30", fullName: "Corujinha" },
]

export const getAvailableLotteries = () => {
  const now = new Date()
  const currentTime = now.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  })

  return lotteries.filter((lottery) => {
    return currentTime < lottery.time
  })
}

export const getBrazilDate = () => {
  return new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}


export const animalGroups = [
  {
    id: 1,
    name: "Avestruz",
    numbers: [1, 2, 3, 4],
  },
  {
    id: 2,
    name: "Águila",
    numbers: [5, 6, 7, 8],
  },
  {
    id: 3,
    name: "Burro",
    numbers: [9, 10, 11, 12],
  },
  {
    id: 4,
    name: "Mariposa",
    numbers: [13, 14, 15, 16],
  },
  {
    id: 5,
    name: "Perro",
    numbers: [17, 18, 19, 20],
  },
  {
    id: 6,
    name: "Caballo",
    numbers: [21, 22, 23, 24],
  },
  {
    id: 7,
    name: "Elefante",
    numbers: [25, 26, 27, 28],
  },
  {
    id: 8,
    name: "Gallo",
    numbers: [29, 30, 31, 32],
  },
  {
    id: 9,
    name: "Gato",
    numbers: [33, 34, 35, 36],
  },
  {
    id: 10,
    name: "Jabalí",
    numbers: [37, 38, 39, 40],
  },
  {
    id: 11,
    name: "Conejo",
    numbers: [41, 42, 43, 44],
  },
  {
    id: 12,
    name: "León",
    numbers: [45, 46, 47, 48],
  },
  {
    id: 13,
    name: "Mono",
    numbers: [49, 50, 51, 52],
  },
  {
    id: 14,
    name: "Pavo",
    numbers: [53, 54, 55, 56],
  },
  {
    id: 15,
    name: "Pavo Real",
    numbers: [57, 58, 59, 60],
  },
  {
    id: 16,
    name: "Toro",
    numbers: [61, 62, 63, 64],
  },
  {
    id: 17,
    name: "Tigre",
    numbers: [65, 66, 67, 68],
  },
  {
    id: 18,
    name: "Oso",
    numbers: [69, 70, 71, 72],
  },
  {
    id: 19,
    name: "Venado",
    numbers: [73, 74, 75, 76],
  },
  {
    id: 20,
    name: "Toro",
    numbers: [77, 78, 79, 80],
  },
  {
    id: 21,
    name: "Gallina",
    numbers: [81, 82, 83, 84],
  },
  {
    id: 22,
    name: "Camello",
    numbers: [85, 86, 87, 88],
  },
  {
    id: 23,
    name: "Serpiente",
    numbers: [89, 90, 91, 92],
  },
  {
    id: 24,
    name: "Veado",
    numbers: [93, 94, 95, 96],
  },
  {
    id: 25,
    name: "Vaca",
    numbers: [97, 98, 99, 0],
  },
]

