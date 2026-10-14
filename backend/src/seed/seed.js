require("dotenv").config();
const bcrypt = require("bcryptjs");
const {
  sequelize, User, Pack, SubPack, Routine, FreeContent, NotificationSetting,
} = require("../models");

async function seed() {
  await sequelize.sync({ force: true }); // CUIDADO: borra y recrea todas las tablas. Solo para desarrollo.

  // --- Admin ---
  const adminPasswordHash = await bcrypt.hash("admin1234", 10);
  const admin = await User.create({
    name: "Karol",
    email: "admin@karolgym.com",
    passwordHash: adminPasswordHash,
    role: "admin",
  });
  await NotificationSetting.create({ userId: admin.id });

  // --- Usuario de prueba ---
  const userPasswordHash = await bcrypt.hash("usuario1234", 10);
  const demoUser = await User.create({
    name: "Usuaria Demo",
    email: "demo@karolgym.com",
    passwordHash: userPasswordHash,
    role: "user",
  });
  await NotificationSetting.create({ userId: demoUser.id });

  // --- Contenido gratuito ---
  await FreeContent.bulkCreate([
    {
      title: "Tecnica de sentadilla",
      category: "Tecnica",
      videoUrl: "https://example.com/videos/tecnica-sentadilla.mp4",
      description: "Aprende la base de una buena sentadilla antes de sumarle peso.",
      durationMinutes: 8,
      isPublished: true,
    },
    {
      title: "Movilidad de cadera",
      category: "Movilidad",
      videoUrl: "https://example.com/videos/movilidad-cadera.mp4",
      description: "Rutina corta para liberar la cadera antes de entrenar.",
      durationMinutes: 10,
      isPublished: true,
    },
    {
      title: "Activacion de CORE",
      category: "CORE",
      videoUrl: "https://example.com/videos/activacion-core.mp4",
      description: "Activa el core antes de cualquier entrenamiento de fuerza.",
      durationMinutes: 6,
      isPublished: true,
    },
    {
      title: "Como empezar a correr",
      category: "Running",
      videoUrl: "https://example.com/videos/empezar-a-correr.mp4",
      description: "Guia para dar tus primeros pasos como runner, sin lesionarte.",
      durationMinutes: 12,
      isPublished: true,
    },
  ]);

  // --- Pack: Full Body Fem ---
  const fullBodyFem = await Pack.create({
    name: "Full Body Fem",
    slug: "full-body-fem",
    description: "Entrenamiento de cuerpo completo pensado para mujeres, con progresiones por nivel.",
    isPublished: true,
    order: 1,
  });

  const inicial2 = await SubPack.create({
    packId: fullBodyFem.id,
    name: "Inicial - 2 dias",
    slug: "inicial-2-dias",
    level: "inicial",
    daysPerWeek: 2,
    price: 9999.0,
    description: "Ideal si estas arrancando: 2 dias por semana, full body, con mancuernas y colchoneta.",
    objective: "Full Body / Fuerza",
    isPublished: true,
    order: 1,
  });

  const inicial3 = await SubPack.create({
    packId: fullBodyFem.id,
    name: "Inicial - 3 dias",
    slug: "inicial-3-dias",
    level: "inicial",
    daysPerWeek: 3,
    price: 12999.0,
    description: "La misma progresion inicial, con un dia extra para acelerar resultados.",
    objective: "Full Body / Fuerza",
    isPublished: true,
    order: 2,
  });

  await Routine.bulkCreate([
    {
      subPackId: inicial2.id,
      title: "Dia 1",
      videoUrl: "https://example.com/videos/full-body-inicial2-dia1.mp4",
      description: "Tren inferior + core. Incluye calentamiento y vuelta a la calma.",
      durationMinutes: 45,
      equipment: "Mancuernas + colchoneta",
      level: "Inicial",
      objective: "Full Body / Fuerza",
      categories: ["Full Body", "Fuerza"],
      order: 1,
    },
    {
      subPackId: inicial2.id,
      title: "Dia 2",
      videoUrl: "https://example.com/videos/full-body-inicial2-dia2.mp4",
      description: "Tren superior + core. Incluye calentamiento y vuelta a la calma.",
      durationMinutes: 45,
      equipment: "Mancuernas + colchoneta",
      level: "Inicial",
      objective: "Full Body / Fuerza",
      categories: ["Full Body", "Fuerza"],
      order: 2,
    },
  ]);

  await Routine.bulkCreate([
    { subPackId: inicial3.id, title: "Dia 1", durationMinutes: 45, equipment: "Mancuernas + colchoneta", level: "Inicial", objective: "Full Body / Fuerza", categories: ["Full Body"], order: 1 },
    { subPackId: inicial3.id, title: "Dia 2", durationMinutes: 45, equipment: "Mancuernas + colchoneta", level: "Inicial", objective: "Full Body / Fuerza", categories: ["Full Body"], order: 2 },
    { subPackId: inicial3.id, title: "Dia 3", durationMinutes: 45, equipment: "Mancuernas + colchoneta", level: "Inicial", objective: "Full Body / Fuerza", categories: ["Full Body"], order: 3 },
  ]);

  // --- Pack: Running ---
  const running = await Pack.create({
    name: "Running",
    slug: "running",
    description: "Planes progresivos para empezar o mejorar tu running.",
    isPublished: true,
    order: 2,
  });

  const runningBase = await SubPack.create({
    packId: running.id,
    name: "Base - 3 dias",
    slug: "base-3-dias",
    level: "inicial",
    daysPerWeek: 3,
    price: 8999.0,
    description: "Construi una base aerobica solida antes de correr tu primera carrera.",
    objective: "Resistencia",
    isPublished: true,
    order: 1,
  });

  await Routine.bulkCreate([
    { subPackId: runningBase.id, title: "Dia 1", durationMinutes: 30, equipment: "Zapatillas", level: "Inicial", objective: "Resistencia", categories: ["Running"], order: 1 },
    { subPackId: runningBase.id, title: "Dia 2", durationMinutes: 30, equipment: "Zapatillas", level: "Inicial", objective: "Resistencia", categories: ["Running"], order: 2 },
    { subPackId: runningBase.id, title: "Dia 3", durationMinutes: 35, equipment: "Zapatillas", level: "Inicial", objective: "Resistencia", categories: ["Running"], order: 3 },
  ]);

  console.log("✅ Seed completo");
  console.log("   Admin -> admin@karolgym.com / admin1234");
  console.log("   Usuario demo -> demo@karolgym.com / usuario1234");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error en el seed:", err);
  process.exit(1);
});
