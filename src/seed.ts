import { prisma } from './lib/prisma';

async function main() {
  // Clear in child-first order so reruns don't break
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  const doctors = await prisma.doctor.createManyAndReturn({
    data: [
      { fullName: 'Dr. Anita Rao', specialty: 'Cardiology', email: 'anita.rao@hospital.com' },
      { fullName: 'Dr. Vikram Shah', specialty: 'Neurology', email: 'vikram.shah@hospital.com' },
      { fullName: 'Dr. Meera Iyer', specialty: 'Cardiology', email: 'meera.iyer@hospital.com' },
    ],
  });

  const patients = await prisma.patient.createManyAndReturn({
    data: [
      { firstName: 'Arun', lastName: 'Kumar', email: 'arun@example.com', phone: '9876500001', dateOfBirth: new Date('1995-04-12') },
      { firstName: 'Priya', lastName: 'Nair', email: 'priya@example.com', phone: '9876500002', dateOfBirth: new Date('1988-09-30') },
      { firstName: 'Rahul', lastName: 'Verma', email: 'rahul@example.com', dateOfBirth: new Date('2001-01-15') },
    ],
  });

  const day = 24 * 60 * 60 * 1000;
  await prisma.appointment.createMany({
    data: [
      { patientId: patients[0].id, doctorId: doctors[0].id, scheduledAt: new Date(Date.now() + 2 * day), reason: 'Chest pain checkup' },
      { patientId: patients[1].id, doctorId: doctors[0].id, scheduledAt: new Date(Date.now() + 3 * day), reason: 'Follow-up' },
      { patientId: patients[2].id, doctorId: doctors[1].id, scheduledAt: new Date(Date.now() + 5 * day), reason: 'Migraine' },
    ],
  });

  console.log('Seeded: 3 doctors, 3 patients, 3 appointments');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
