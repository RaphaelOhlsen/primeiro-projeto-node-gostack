import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

const appointmentsRouter = Router();

const appointments: Appointment[] = [];

appointmentsRouter.post('/', (req, res) => {
  const { provider, date } = req.body;

  const parseDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointments.find(appointment =>
    isEqual(parseDate, appointment.date),
  );

  if (findAppointmentInSameDate) {
    return res
      .status(400)
      .json({ message: 'This appointment is already bokked' });
  }

  const appointment = new Appointment(provider, parseDate);

  appointments.push(appointment);

  return res.json(appointment);
});

export default appointmentsRouter;
