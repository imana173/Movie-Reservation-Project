import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from '../../src/reservation/reservation.controller';
import { ReservationService } from '../../src/reservation/reservation.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';


describe('ReservationController', () => {
  let controller: ReservationController;
  let reservationService: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            createReservation: jest.fn().mockResolvedValue({ id: 1, movieId: 102, startTime: new Date() }),
            GetUserReservations: jest.fn().mockResolvedValue([{ id: 1, movieId: 102, startTime: new Date() }]),
            DeleteReservationById: jest.fn().mockResolvedValue({ message: 'Réservation annulée avec succès.' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 1, email: 'test@example.com' };
          return true;
        }),
      })
      .compile();

    controller = module.get<ReservationController>(ReservationController);
    reservationService = module.get<ReservationService>(ReservationService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      const req = { user: { id: 1 } };
      const body = { movieId: 102, startTime: new Date().toISOString() };

      const result = await controller.createReservation(req, body);

      expect(result).toEqual({ id: 1, movieId: 102, startTime: expect.any(Date) });
      expect(reservationService.createReservation).toHaveBeenCalledWith(req.user, 102, expect.any(Date));
    });

    it('should throw BadRequestException if movieId is missing', async () => {
      const req = { user: { id: 1 } };
      const body = { startTime: new Date().toISOString() };

      await expect(controller.createReservation(req, body)).rejects.toThrowError();
    });
  });

  describe('GetUserReservation', () => {
    it('should return user reservations', async () => {
      const req = { user: { id: 1 } };
      const result = await controller.GetUserReservation(req);

      expect(result).toEqual([{ id: 1, movieId: 102, startTime: expect.any(Date) }]);
      expect(reservationService.GetUserReservations).toHaveBeenCalledWith(req.user);
    });
  });

  describe('cancelReservation', () => {
    it('should delete reservation successfully', async () => {
      const req = { user: { id: 1 } };
      const reservationId = 1;

      const result = await controller.cancelReservation(req, reservationId);

      expect(result).toEqual({ message: 'Réservation annulée avec succès.' });
      expect(reservationService.DeleteReservationById).toHaveBeenCalledWith(req.user, reservationId);
    });
  });
});
