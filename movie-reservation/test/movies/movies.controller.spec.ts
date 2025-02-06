import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../../src/movies/movies.controller';
import { MoviesService } from '../../src/movies/movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: jest.fn().mockResolvedValue([]), // ✅ Mock `MoviesService`
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});



