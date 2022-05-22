/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  url: string = environment.apiUrl + 'pokemon/';
  _pokemons: any[] = [];
  _next: string = '';
  constructor(private http: HttpClient) {}
  get pokemons(): any[] {;
    return this._pokemons;
  }

  set pokemons(pokemon) {;
    this._pokemons = pokemon;
  }
  
  get next(): string {
    return this._next;
  }

  set next(next: string) {
    this._next = next;
  }

  getType(pokemon: any): string {
    return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';
  }

  get(name: string): Observable<any> {
    const url = `${this.url}${name}`;
    return this.http.get(url);
  }

  getNext(): Observable<any> {
    const url = this.next === '' ? `${this.url}?limit=20` : this.next;
    return this.http.get(url);
  }

  getPokemonByType(num: number): Observable<any> {
    const url = `${environment.apiUrl}type/${num}`;
    return this.http.get(url);
  }

  getEvolution(id: number): Observable<any> {
    const url = `${environment.apiUrl}evolution-chain/${id}`;
    return this.http.get(url);
  }

  getSpecies(name: string): Observable<any> {
    const url = `${environment.apiUrl}pokemon-species/${name}`;
    return this.http.get(url);
  }

  setTypeIcon(type: string) {
    switch(type) { 
      case 'fire': {
        return "flame";  
      } 
      case 'water': { 
        return "water";
      } 
      case 'grass': { 
        return "leaf";
      } 
      case 'bug': {
        return "bug";
      }
      case 'ice': {
        return "snow";
      }
      case 'electric': {
        return "flash";
      }
      case 'poison': {
        return "nuclear";
      }
      default: { 
        return "";
      } 
   } 
  }
}
