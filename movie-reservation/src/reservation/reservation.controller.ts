import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reservations')
@ApiBearerAuth() 
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle réservation un token JWT nécessaire.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        movieId: { type: 'number', example: 102 },
        startTime: { type: 'string', format: 'date-time', example: '2025-02-10T14:00:00Z' },
      },
      required: ['movieId', 'startTime'],
    },
  })
  @ApiResponse({ status: 201, description: 'Réservation créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Paramètres invalides.' })
  async createReservation(@Req() req, @Body() body) {
    console.log('Utilisateur connecté:', req.user);
    if (!body.movieId) throw new BadRequestException('Le MovieId est requis.');
    if (!body.startTime) throw new BadRequestException('La date de début est requise.');
    return this.reservationService.createReservation(req.user, body.movieId, new Date(body.startTime));
  }











  @Get()
  @ApiOperation({ summary: 'Récupérer les réservations de l\'utilisateur connecté un token JWT nécessaire.' })
  @ApiResponse({ status: 200, description: 'Liste des réservations de l’utilisateur.' })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide.' })
  async GetUserReservation(@Req() req) {
    console.log('Utilisateur connecté:', req.user);
    return this.reservationService.GetUserReservations(req.user);
  }




  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation un token JWT nécessaire.' })
  @ApiParam({ name: 'id', required: true, type: Number, description: 'ID de la réservation à annuler' })
  @ApiResponse({ status: 200, description: 'Réservation annulée avec succès.' })
  @ApiResponse({ status: 404, description: 'Réservation introuvable.' })
  async cancelReservation(@Req() req, @Param('id') id: number) {
    console.log(' Suppression de la réservation:', { userId: req.user.id, reservationId: id });
    return this.reservationService.DeleteReservationById(req.user, id);
  }
}





