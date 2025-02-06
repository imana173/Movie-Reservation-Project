import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../../src/movies/movies.service';
import { ConfigService } from '@nestjs/config';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ results: [] }), // ✅ Mock de fetch()
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('FAKE_API_KEY'),
          },
        },
      ],
    })
      .overrideProvider('HttpService') // ✅ Ignore `HttpService`
      .useValue(null) // ✅ Dit à NestJS qu'il n'y a pas besoin de `HttpService`
      .compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // ✅ Nettoie les mocks après chaque test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call fetch with correct URL when no search query is provided', async () => {
    await service.getMovies(1, '', 'release_date');
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/discover/movie?api_key=FAKE_API_KEY&page=1&sort_by=release_date.desc'
    );
  });

  it('should call fetch with correct URL when search query is provided', async () => {
    await service.getMovies(1, 'Batman', 'release_date');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/search/movie?api_key=FAKE_API_KEY&page=1&query=Batman'
    );
  });
});




