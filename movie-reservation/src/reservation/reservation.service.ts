import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Reservation } from './reservation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async createReservation(user: User, movieId: number, startTime: Date) {
    if (!movieId) {
      throw new BadRequestException('movieId est obligatoire.');
    }
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 2);
    
    const conflict = await this.reservationRepository.findOne({
      where: {
        user: { id: user.id },
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });
    if (conflict) {
      throw new ConflictException('Vous avez déjà une réservation sur ce créneau.');
    }
    const reservation = this.reservationRepository.create({
      user,
      movieId,
      startTime,
      endTime,
    });
  
    await this.reservationRepository.insert(reservation);
    return reservation;
  }
  

  async GetUserReservations(user: User) {
    return this.reservationRepository.find({ where: { user } });
  }



  async DeleteReservationById(user: User, reservationId: number) {
   reservationId = Number(reservationId); 
    const reservations = await this.reservationRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  
    let reservationFound;
    for (const reservation of reservations) {
      if (reservation.id === reservationId) {
        reservationFound = reservation;
        break;
      }
    }
  
    if (!reservationFound) {
      throw new NotFoundException('Réservation non trouvée');
    }
  
    await this.reservationRepository.remove(reservationFound);
  
    return { message: 'Réservation annulée avec succès.' };
  }
  
  
  
  
}



