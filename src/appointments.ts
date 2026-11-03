import { prisma } from './lib/prisma';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface NewAppointment {
  patientId: number;
  doctorId: number;
  scheduledAt: Date;
  reason?: string;
}

export function bookAppointment({ patientId, doctorId, scheduledAt, reason }: NewAppointment) {
  return prisma.appointment.create({
    data: {
      scheduledAt,
      reason,
      Patient: { connect: { id: patientId } },
      Doctor: { connect: { id: doctorId } },
    },
    include: { Patient: true, Doctor: true },
  });
}

export function getAppointmentFull(id: number) {
  return prisma.appointment.findUnique({
    where: { id },
    include: { Patient: true, Doctor: true },
  });
}

export function getDoctorUpcomingAppointments(doctorId: number) {
  return prisma.appointment.findMany({
    where: {
      doctorId,
      status: 'scheduled',
      scheduledAt: { gte: new Date() },
    },
    include: { Patient: true },
    orderBy: { scheduledAt: 'asc' },
  });
}

export function setAppointmentStatus(id: number, status: AppointmentStatus) {
  return prisma.appointment.update({ where: { id }, data: { status } });
}

// Returns { count: n } - how many rows were changed
export function cancelAllPatientAppointments(patientId: number) {
  return prisma.appointment.updateMany({
    where: { patientId, status: 'scheduled' },
    data: { status: 'cancelled' },
  });
}

export function deleteAppointment(id: number) {
  return prisma.appointment.delete({ where: { id } });
}
