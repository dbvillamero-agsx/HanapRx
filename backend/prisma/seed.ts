import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@hanaprx.com" },
    update: {},
    create: {
      email: "admin@hanaprx.com",
      passwordHash,
      role: "admin",
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // Create Mercury Drug pharmacy
  const mercury = await prisma.pharmacy.create({
    data: {
      name: "Mercury Drug",
      logoUrl: null,
    },
  });
  console.log("Pharmacy created: Mercury Drug");

  // Create Mercury Drug branches across Cebu
  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - Colon St",
        address: "Colon St, Cebu City, Cebu",
        latitude: 10.2942,
        longitude: 123.9010,
        contactNumber: "(032) 255-1234",
        businessHours: "Mon-Sun: 7:00 AM - 10:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - Ayala Center",
        address: "Ayala Center Cebu, Cebu Business Park, Cebu City",
        latitude: 10.3181,
        longitude: 123.9050,
        contactNumber: "(032) 255-2345",
        businessHours: "Mon-Sun: 10:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - SM City Cebu",
        address: "SM City Cebu, Juan Luna Ave, North Reclamation Area, Cebu City",
        latitude: 10.3119,
        longitude: 123.9186,
        contactNumber: "(032) 255-3456",
        businessHours: "Mon-Sun: 10:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - IT Park",
        address: "Asiatown IT Park, Lahug, Cebu City",
        latitude: 10.3302,
        longitude: 123.9058,
        contactNumber: "(032) 255-4567",
        businessHours: "Mon-Sun: 8:00 AM - 10:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - Fuente Osmeña",
        address: "Fuente Osmeña Circle, Cebu City",
        latitude: 10.3103,
        longitude: 123.8914,
        contactNumber: "(032) 255-5678",
        businessHours: "Mon-Sun: 7:00 AM - 10:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - Mango Ave",
        address: "Gen. Maxilom Ave (Mango Ave), Cebu City",
        latitude: 10.3088,
        longitude: 123.8938,
        contactNumber: "(032) 255-6789",
        businessHours: "Mon-Sun: 7:00 AM - 11:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - Robinsons Galleria",
        address: "Robinsons Galleria Cebu, Gen. Maxilom Ave, Cebu City",
        latitude: 10.3140,
        longitude: 123.8960,
        contactNumber: "(032) 255-7890",
        businessHours: "Mon-Sun: 10:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Mandaue - Pacific Mall",
        address: "Pacific Mall, M.C. Briones St, Mandaue City, Cebu",
        latitude: 10.3333,
        longitude: 123.9365,
        contactNumber: "(032) 255-8901",
        businessHours: "Mon-Sun: 9:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Mandaue - Parkmall",
        address: "Parkmall, Ouano Ave, Mandaue City, Cebu",
        latitude: 10.3421,
        longitude: 123.9321,
        contactNumber: "(032) 255-9012",
        businessHours: "Mon-Sun: 10:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Lapu-Lapu - Mactan Marina",
        address: "Marina Mall, Mactan, Lapu-Lapu City, Cebu",
        latitude: 10.3080,
        longitude: 123.9620,
        contactNumber: "(032) 255-0123",
        businessHours: "Mon-Sun: 8:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Lapu-Lapu - Island Central",
        address: "Island Central Mactan, Pusok, Lapu-Lapu City, Cebu",
        latitude: 10.3148,
        longitude: 123.9551,
        contactNumber: "(032) 255-1122",
        businessHours: "Mon-Sun: 10:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Talisay - Gaisano Talisay",
        address: "Gaisano Grand Mall, Talisay City, Cebu",
        latitude: 10.2447,
        longitude: 123.8494,
        contactNumber: "(032) 255-2233",
        businessHours: "Mon-Sun: 8:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - Banilad Town Centre",
        address: "Banilad Town Centre, Gov. M. Cuenco Ave, Banilad, Cebu City",
        latitude: 10.3396,
        longitude: 123.9126,
        contactNumber: "(032) 255-3344",
        businessHours: "Mon-Sun: 9:00 AM - 9:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Cebu City - JY Square",
        address: "JY Square Mall, Lahug, Cebu City",
        latitude: 10.3337,
        longitude: 123.8995,
        contactNumber: "(032) 255-4455",
        businessHours: "Mon-Sun: 8:00 AM - 10:00 PM",
      },
    }),
    prisma.branch.create({
      data: {
        pharmacyId: mercury.id,
        name: "Minglanilla - South Town Centre",
        address: "South Town Centre, Minglanilla, Cebu",
        latitude: 10.2344,
        longitude: 123.7965,
        contactNumber: "(032) 255-5566",
        businessHours: "Mon-Sun: 8:00 AM - 9:00 PM",
      },
    }),
  ]);

  console.log(`${branches.length} branches created`);

  // Create medicines
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        name: "Biogesic",
        genericName: "Paracetamol 500mg",
        description: "For relief of mild to moderate pain and fever",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Neozep",
        genericName: "Phenylephrine + Chlorphenamine + Paracetamol",
        description: "For relief of clogged nose, runny nose, headache, and fever",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Bioflu",
        genericName: "Phenylephrine + Chlorphenamine + Paracetamol",
        description: "Multi-symptom flu relief",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Solmux",
        genericName: "Carbocisteine 500mg",
        description: "For cough with phlegm",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Amoxicillin 500mg",
        genericName: "Amoxicillin",
        description: "Antibiotic for bacterial infections (requires prescription)",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Losartan 50mg",
        genericName: "Losartan Potassium",
        description: "For high blood pressure treatment (requires prescription)",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Metformin 500mg",
        genericName: "Metformin Hydrochloride",
        description: "For type 2 diabetes management (requires prescription)",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Omeprazole 20mg",
        genericName: "Omeprazole",
        description: "For acid reflux and stomach ulcers",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Cetirizine 10mg",
        genericName: "Cetirizine Dihydrochloride",
        description: "Antihistamine for allergy relief",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Ibuprofen 200mg",
        genericName: "Ibuprofen",
        description: "For pain, fever, and inflammation",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Amlodipine 5mg",
        genericName: "Amlodipine Besylate",
        description: "For high blood pressure and chest pain (requires prescription)",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Loperamide 2mg",
        genericName: "Loperamide Hydrochloride",
        description: "For diarrhea relief",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Mefenamic Acid 500mg",
        genericName: "Mefenamic Acid",
        description: "For mild to moderate pain and dysmenorrhea",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Kremil-S",
        genericName: "Aluminum Hydroxide + Magnesium Hydroxide + Simethicone",
        description: "For hyperacidity, heartburn, and gas",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Diatabs",
        genericName: "Loperamide 2mg",
        description: "For acute and chronic diarrhea",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Tempra",
        genericName: "Paracetamol 250mg/5ml",
        description: "Fever and pain relief for children",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Decolgen",
        genericName: "Phenylpropanolamine + Chlorphenamine + Paracetamol",
        description: "For colds, nasal congestion, and headache",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Medicol Advance",
        genericName: "Ibuprofen 400mg",
        description: "For headache, toothache, and body pain",
      },
    }),
  ]);

  console.log(`${medicines.length} medicines created`);

  // Create inventory with varied stock and prices per branch
  const inventoryData: { branchId: number; medicineId: number; stockCount: number; price: number }[] = [];

  // Price ranges per medicine (in PHP)
  const priceMap: Record<number, [number, number]> = {};
  medicines.forEach((m, i) => {
    const bases: [number, number][] = [
      [5, 8],      // Biogesic
      [7, 12],     // Neozep
      [9, 14],     // Bioflu
      [8, 13],     // Solmux
      [6, 12],     // Amoxicillin
      [8, 15],     // Losartan
      [5, 10],     // Metformin
      [10, 18],    // Omeprazole
      [4, 8],      // Cetirizine
      [5, 9],      // Ibuprofen
      [7, 14],     // Amlodipine
      [6, 10],     // Loperamide
      [5, 9],      // Mefenamic
      [7, 12],     // Kremil-S
      [8, 13],     // Diatabs
      [45, 75],    // Tempra (syrup)
      [6, 10],     // Decolgen
      [9, 15],     // Medicol Advance
    ];
    priceMap[m.id] = bases[i] || [5, 15];
  });

  for (const branch of branches) {
    for (const medicine of medicines) {
      // 90% chance branch carries this medicine
      if (Math.random() < 0.9) {
        const stockCount = Math.random() < 0.1 ? 0 : Math.floor(Math.random() * 50) + 1;
        const [min, max] = priceMap[medicine.id];
        const price = Math.round((min + Math.random() * (max - min)) * 100) / 100;

        inventoryData.push({
          branchId: branch.id,
          medicineId: medicine.id,
          stockCount,
          price,
        });
      }
    }
  }

  for (const item of inventoryData) {
    await prisma.inventory.create({ data: item });
  }

  console.log(`${inventoryData.length} inventory records created`);
  console.log("\nSeed completed!");
  console.log("Admin login: admin@hanaprx.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
