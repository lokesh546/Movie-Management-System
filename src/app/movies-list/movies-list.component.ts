import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from 'src/Users';
import { loginservice } from './../Services/loginservice';
import { Movie } from './../../Movie';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FavouriteList } from './../../FavouriteList';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css'],
})
export class MoviesListComponent implements OnInit {
  username: String = '';
  users: Users[] = [];
  user: Users[] = [];
  Movies: Movie[] = [];
  userMovies: any[] = [];
  Movie_Add: Movie = new Movie();
  movie: any[];
  FavouriteMovies: any[] = [];
  paramsObject: any;
  isAdmin: boolean = false;
  EditClicked: boolean = false;
  description: string;
  updateData: FormGroup;
  userId: number;
  FavouriteLists: FavouriteList[];
  AddFavouriteList: FavouriteList = new FavouriteList();
  @ViewChild('updateDialog') updateDialog: TemplateRef<any>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private login: loginservice,
    private dialog: MatDialog
  ) {
    router.canceledNavigationResolution = 'computed';
  }
  ngOnInit(): void {
    this.updateData = new FormGroup({
      Name: new FormControl(['', Validators.required]),
      Year: new FormControl([
        '',
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      Description: new FormControl(['', Validators.required]),
    });
    this.route.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params };
      this.username = this.paramsObject.params.username;
    });
    this.login.getUsers().subscribe(
      (res) => {
        if (res != null && res != undefined) {
          this.users = res;
          this.user = this.users.filter((user) => {
            return this.username == user.user_name;
          });
          this.userId = this.user[0].id;
          this.isAdmin = this.user[0].Admin;
          console.log(this.isAdmin);
        }
      },
      (error) => {
        alert('someting went Wrong');
      }
    );
    this.getMovies();
  }
  getMovies() {
    this.login.getMovies().subscribe(
      (res) => {
        if (res != null && res != undefined) {
          this.Movies = res;
          this.Movies.forEach((Movies) => {
            console.log(Movies);
          });
        }
      },
      (error) => {
        alert('someting went Wrong');
      }
    );
  }
  Updatedetails(id: number) {
    if (!this.updateData.invalid) {
      let { Name, Year, Description } = this.updateData.value;
      this.movie[0].Name = Name;
      this.movie[0].Year = Year;
      this.movie[0].Description = Description;
      console.log(this.movie);
      this.login.updateMovies(id, this.movie).subscribe(
        (res) => {
          console.log(res);
          if (res != null && res != undefined) {
            this.dialog.closeAll();
            this.getMovies();
          }
        },
        (error) => {
          alert('Something Went Wrong');
        }
      );
    }
  }
  logOut() {
    window.localStorage.clear();
    this.router.navigateByUrl('login');
  }
  delete(id: number) {
    this.login.deleteMovie(id).subscribe(
      (res) => {
        if (res != null && res != undefined) {
          alert('deleted movie sucessfully');
          this.getMovies();
        }
      },
      (err) => {
        alert('Something went wrong!');
      }
    );
  }
  update(id: number) {
    this.EditClicked = true;
    this.description = 'Update Movie';
    this.movie = this.Movies.filter((res) => res.id == id);
    this.updateData.get('Name')?.setValue(this.movie[0].Name);
    this.updateData.get('Description')?.setValue(this.movie[0].Description);
    this.updateData.get('Year')?.setValue(this.movie[0].Year);
    this.openDialog();
  }
  Search(target: any) {
    let value = target.value.toLocaleLowerCase();
    if (value == '') {
      this.getMovies();
    } else {
      this.Movies = this.Movies.filter((res) => {
        return res.Name.toLowerCase().match(value.toLowerCase());
      });
    }
  }
  openDialog() {
    let dialogref = this.dialog.open(this.updateDialog, {
      data: this.movie,
    });
    dialogref.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (result !== 'no') {
          const enabled = 'Y';
          console.log(result);
        }
      } else if (result === 'no') {
        console.log('user clicked no');
      }
    });
  }
  Add() {
    this.EditClicked = false;
    this.description = 'Add Movie';
    this.updateData.reset();
    this.openDialog();
  }
  AddMovie() {
    if (!this.updateData.invalid) {
      let { Name, Year, Description } = this.updateData.value;
      this.getMovies();
      if (
        this.Movies.find((movie) => {
          return movie.Name.toLocaleLowerCase() == Name.toLocaleLowerCase();
        })
      ) {
        alert('Movie is already there!!');
      } else {
        this.movie = [];
        this.Movie_Add.Name = Name;
        this.Movie_Add.Year = Year;
        this.Movie_Add.Description = Description;
        this.login.AddMovies(this.Movie_Add).subscribe(
          (res) => {
            if (res != undefined && res != null) {
              alert('Movie added Sucessfully');
              this.getMovies();
              this.dialog.closeAll();
            }
          },
          (error) => {
            alert('Something Went wrong');
          }
        );
      }
    }
  }
  logout() {
    window.localStorage.clear();
    this.router.navigateByUrl('login');
  }
  tabClick(event: any) {
    if (event.index == 1) {
      this.getFavouriteList();
    }
  }
  getFavouriteList() {
    console.log('called');
    this.login.getFourite(this.userId).subscribe((res) => {
      if (res != undefined && res != null) {
        this.FavouriteLists = [];
        this.FavouriteLists = res;
        console.log(this.FavouriteLists);
        this.getMovies();
        console.log(this.Movies);
        this.FavouriteMovies = this.Movies.filter((res) => {
          let movie = this.FavouriteLists.filter(
            (res1) => res1.Movie_id == res.id
          );
          console.log(movie);
          return movie.length!= 0 && movie[0].Movie_id == res.id;
        });
        this.FavouriteMovies.forEach((res) => {
          let movie = this.FavouriteLists.filter(
            (res1) => res1.Movie_id == res.id
          );
          if (movie != undefined) {
            res['Movie_id'] = movie[0].id;
          }
        });
        console.log(this.FavouriteMovies);
        console.log(this.FavouriteMovies);
      }
    });
  }
  AddFavourite(id: any) {
    this.login.getFourite(this.userId).subscribe((res) => {
      if (res != undefined && res != null) {
        this.FavouriteLists = res;
        if (
          this.FavouriteLists.find((res) => {
            return res.Movie_id === id;
          })
        ) {
          alert('Already in Favourite List');
        } else {
          this.AddFavouriteList.Movie_id = id;
          this.AddFavouriteList.user_id = this.userId;
          this.login.AddFavourite(this.AddFavouriteList).subscribe(
            (res) => {
              alert('Added to Favourite List!!');
            },
            (error) => {
              alert('Something Went Wrong');
            }
          );
        }
      }
    });
  }
  RemoveFavourite(Movie_id: number, id: number) {
    this.login.RemoveFavourite(Movie_id, id, this.userId).subscribe(
      (res) => {
        if (res != undefined && res != null) {
          this.getFavouriteList();
          alert('Removed sucessfullty');
        }
      },
      (err) => {
        alert('something went wrong');
      }
    );
  }
}
