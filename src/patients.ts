import { prisma } from './lib/prisma';

export interface NewPatient {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
}

export function createPatient(data: NewPatient) {
  return prisma.patient.create({ data });
}

export function getPatient(id: number) {
  return prisma.patient.findUnique({ where: { id } });
}

// Matches first name, last name or email, ignoring upper/lower case
export function searchPatients(term: string) {
  return prisma.patient.findMany({
    where: {
      OR: [
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
      ],
    },
    orderBy: { lastName: 'asc' },
  });
}

export function updatePatientPhone(id: number, phone: string) {
  return prisma.patient.update({ where: { id }, data: { phone } });
}

export function deletePatient(id: number) {
  return prisma.patient.delete({ where: { id } });
}
