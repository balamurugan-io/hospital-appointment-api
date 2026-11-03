import { prisma } from './lib/prisma';
import { createPatient, getPatient, searchPatients, updatePatientPhone, deletePatient } from './patients';
import { createDoctor, getDoctor, listDoctorsBySpecialty, deleteDoctor } from './doctors';
import {
  bookAppointment, getAppointmentFull, getDoctorUpcomingAppointments,
  setAppointmentStatus, cancelAllPatientAppointments, deleteAppointment,
} from './appointments';

async function main() {
  console.log('--- Patients ---');
  const patient = await createPatient({
    firstName: 'Test', lastName: 'Patient',
    email: `test-${Date.now()}@example.com`, dateOfBirth: new Date('1999-05-05'),
  });
  console.log('createPatient:', patient);
  console.log('getPatient:', await getPatient(patient.id));
  console.log('searchPatients("test"):', (await searchPatients('test')).length, 'found');
  console.log('updatePatientPhone:', await updatePatientPhone(patient.id, '9999999999'));

  console.log('--- Doctors ---');
  const doctor = await createDoctor({
    fullName: 'Dr. Test', specialty: 'Dermatology', email: `dr-${Date.now()}@hospital.com`,
  });
  console.log('createDoctor:', doctor);
  console.log('getDoctor:', await getDoctor(doctor.id));
  console.log('listDoctorsBySpecialty:', await listDoctorsBySpecialty('dermatology'));

  console.log('--- Appointments ---');
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const appt = await bookAppointment({
    patientId: patient.id, doctorId: doctor.id, scheduledAt: nextWeek, reason: 'Skin rash',
  });
  console.log('bookAppointment:', appt);
  console.log('getAppointmentFull:', await getAppointmentFull(appt.id));
  console.log('getDoctorUpcomingAppointments:', await getDoctorUpcomingAppointments(doctor.id));
  console.log('setAppointmentStatus:', await setAppointmentStatus(appt.id, 'completed'));

  const appt2 = await bookAppointment({
    patientId: patient.id, doctorId: doctor.id, scheduledAt: nextWeek,
  });
  console.log('cancelAllPatientAppointments:', await cancelAllPatientAppointments(patient.id));
  console.log('deleteAppointment:', await deleteAppointment(appt2.id));

  console.log('--- Cleanup ---');
  console.log('deleteDoctor:', await deleteDoctor(doctor.id));
  console.log('deletePatient:', await deletePatient(patient.id));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
