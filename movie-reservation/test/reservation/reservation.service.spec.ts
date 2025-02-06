import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from '../../src/reservation/reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '../../src/reservation/reservation.entity';
import { Repository } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: Repository<Reservation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            insert: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservation', () => {
    it('should throw BadRequestException if movieId is missing', async () => {
        const user = { id: 1 } as User;
        await expect(service.createReservation(user, undefined as unknown as number, new Date()))
          .rejects.toThrow(BadRequestException);
      });
      

    it('should throw ConflictException if user already has a reservation at the same time', async () => {
      const user = { id: 1 } as User;
      const startTime = new Date();
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 2);

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue({ id: 1 } as Reservation);

      await expect(service.createReservation(user, 102, startTime))
        .rejects.toThrow(ConflictException);
    });

    it('should create a reservation successfully', async () => {
      const user = { id: 1 } as User;
      const startTime = new Date();
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 2);

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(reservationRepository, 'create').mockReturnValue({
        user,
        movieId: 102,
        startTime,
        endTime,
      } as Reservation);jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(Promise.resolve(null));


      const result = await service.createReservation(user, 102, startTime);

      expect(result).toEqual({
        user,
        movieId: 102,
        startTime,
        endTime,
      });
      expect(reservationRepository.create).toHaveBeenCalled();
      expect(reservationRepository.insert).toHaveBeenCalled();
    });
  });

  describe('GetUserReservations', () => {
    it('should return user reservations', async () => {
      const user = { id: 1 } as User;
      const reservations = [
        { id: 1, movieId: 102, startTime: new Date(), endTime: new Date() } as Reservation,
      ];
      jest.spyOn(reservationRepository, 'find').mockResolvedValue(reservations);

      const result = await service.GetUserReservations(user);
      expect(result).toEqual(reservations);
    });
  });

  describe('DeleteReservationById', () => {
    it('should throw NotFoundException if reservation does not exist', async () => {
      const user = { id: 1 } as User;
      jest.spyOn(reservationRepository, 'find').mockResolvedValue([]);

      await expect(service.DeleteReservationById(user, 999))
        .rejects.toThrow(NotFoundException);
    });

    it('should delete reservation successfully', async () => {
      const user = { id: 1 } as User;
      const reservation = { id: 1, user } as Reservation;

      jest.spyOn(reservationRepository, 'find').mockResolvedValue([reservation]);
      jest.spyOn(reservationRepository, 'remove').mockImplementation(async (reservation: DeepPartial<Reservation>) => {
        return Promise.resolve(reservation as Reservation);
      });

      const result = await service.DeleteReservationById(user, 1);

      expect(result).toEqual({ message: 'Réservation annulée avec succès.' });
      expect(reservationRepository.remove).toHaveBeenCalledWith(reservation);
    });
  });
});
