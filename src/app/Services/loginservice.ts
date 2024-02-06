import { Call } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from 'src/Users';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { Movie } from 'src/Movie';
import { FavouriteList } from './../../FavouriteList';
@Injectable({
  providedIn: 'root',
})
export class loginservice {
  constructor(private http: HttpClient) {}
  url: String = 'http://localhost:3000/';
  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.url + 'users').pipe(
      map((data: Users[]) => {
        console.log(data);
        return data;
      })
    );
  }
  postUsers(Users: any) {
    return this.http.post<Users>(this.url + 'users', Users);
  }
  private getUsersName = new BehaviorSubject<string>('');
  username = this.getUsersName.asObservable();
  setUserName(username: string) {
    this.getUsersName.next(username);
  }
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.url + 'movies');
  }
  deleteMovie(id: number) {
    return this.http.delete(this.url + `movies/${id}`);
  }
  updateMovies(id: number, Movie: any): Observable<any> {
    console.log(id, Movie);
    let movie = {
      Name: Movie[0].Name,
      Year: Movie[0].Year,
      Description: Movie[0].Description,
    };
    console.log(movie);
    return this.http
      .put(this.url + `movies/${id}`, movie)
      .pipe(map((res: any) => res));
  }
  AddMovies(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.url + 'movies', movie);
  }
  getFourite(user_id: number) {
    return this.http.get<FavouriteList[]>(
      this.url + `Favourite/?user_id=${user_id}`
    );
  }
  AddFavourite(favourite: FavouriteList) {
    return this.http.post<FavouriteList>(this.url + 'Favourite', favourite);
  }
  RemoveFavourite(Movie_id: number, id: number, user_id: number) {
    return this.http.delete(
      this.url + `Favourite/${Movie_id}?user_id=${user_id}&Movie_id=${id}`
    );
  }
}
