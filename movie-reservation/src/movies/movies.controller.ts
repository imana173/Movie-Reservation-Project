import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@ApiTags('Movies') 
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'numéro de la page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'rechercher un film par titre' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'tri par défaut: release_date' })



  
  async getMovies(
    @Query('page') page: number = 1,
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'release_date',
  ) {
    return this.moviesService.getMovies(page, search, sort);
  }
}




