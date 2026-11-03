import { prisma } from './lib/prisma';

export interface NewDoctor {
  fullName: string;
  specialty: string;
  email: string;
}

export function createDoctor(data: NewDoctor) {
  return prisma.doctor.create({ data });
}

export function getDoctor(id: number) {
  return prisma.doctor.findUnique({ where: { id } });
}

export function listDoctorsBySpecialty(specialty: string) {
  return prisma.doctor.findMany({
    where: { specialty: { equals: specialty, mode: 'insensitive' } },
    orderBy: { fullName: 'asc' },
  });
}

export function deleteDoctor(id: number) {
  return prisma.doctor.delete({ where: { id } });
}
