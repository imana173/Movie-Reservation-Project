import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';  
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, 
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY')!;
  }

  
  async getMovies(page: number, search: string, sort: string) {
    let url = `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&page=${page}&sort_by=${sort}.desc`;
    if (search) {
     url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&page=${page}&query=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url);
    return response.json(); 
  }
}

