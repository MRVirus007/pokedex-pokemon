/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loadMoreBtn: boolean = true;
  loading: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(private pokemonService: PokemonService, private router: Router, private actionSheet: ActionSheetController) { }
  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  set pokemons(pokemons) {
    this.pokemonService.pokemons = pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  loadMore(): void {
    this.loading = true;
    this.subscription = this.pokemonService.getNext().subscribe(response => {
      this.pokemonService.next = response.next;
      const details = response.results.map((i: any) => this.pokemonService.get(i.name));
      this.subscription = concat(...details).subscribe((response: any) => {
        this.pokemonService.pokemons.push(response);
      });
    }, error => console.log('Error Occurred:', error), () => this.loading = false);
  }

  setPokemonByType(num: number) {
    this.pokemons = [];
    this.subscription = this.pokemonService.getPokemonByType(num).subscribe(response => {
      const details = response.pokemon.map((i: any) => this.pokemonService.get(i["pokemon"]["name"]));
      this.subscription = concat(...details).subscribe((response: any) => {
        this.pokemonService.pokemons.push(response);
      });
      this.loadMoreBtn = false;
    }, error => console.log('Error Occurred:', error));
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

  goToDetails(name: any) {
    if (typeof name === 'string' || name instanceof String) {
      this.router.navigate(['/details', name.toLowerCase()]);
    } else {
      this.router.navigate(['/details', name.target.value.toLowerCase()]);
    }
  }

  setTypeIcon(type: string) {
    return this.pokemonService.setTypeIcon(type);
  }

  openActionSheet() {
    this.actionSheet.create({
      header: 'Select Pokemon Type',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'All',
          icon: '',
          handler: () => {
            this.loadMoreBtn = true;
            var url = window.location.hostname;
            if (url === 'localhost') {
              location.href = "http://localhost:8100";
            } else {
              location.href = "https://pokedex.mrokerya.com/";
            }
          }
        },
        {
          text: 'Normal',
          icon: '',
          handler: () => {
            this.setPokemonByType(1);
          }
        },
        {
          text: 'Fighting',
          icon: '',
          handler: () => {
            this.setPokemonByType(2);
          }
        },
        {
          text: 'Flying',
          icon: '',
          handler: () => {
            this.setPokemonByType(3);
          }
        },
        {
          text: 'Poison',
          icon: '',
          handler: () => {
            this.setPokemonByType(4);
          }
        },
        {
          text: 'Ground',
          icon: '',
          handler: () => {
            this.setPokemonByType(5);
          }
        },
        {
          text: 'Rock',
          icon: '',
          handler: () => {
            this.setPokemonByType(6);
          }
        },
        {
          text: 'Bug',
          icon: '',
          handler: () => {
            this.setPokemonByType(7);
          }
        },
        {
          text: 'Ghost',
          icon: '',
          handler: () => {
            this.setPokemonByType(8);
          }
        },
        {
          text: 'Steel',
          icon: '',
          handler: () => {
            this.setPokemonByType(9);
          }
        },
        {
          text: 'Fire',
          icon: '',
          handler: () => {
            this.setPokemonByType(10);
          }
        },
        {
          text: 'Water',
          icon: '',
          handler: () => {
            this.setPokemonByType(11);
          }
        },
        {
          text: 'Grass',
          icon: '',
          handler: () => {
            this.setPokemonByType(12);
          }
        },
        {
          text: 'Electric',
          icon: '',
          handler: () => {
            this.setPokemonByType(13);
          }
        },
        {
          text: 'Psychic',
          icon: '',
          handler: () => {
            this.setPokemonByType(14);
          }
        },
        {
          text: 'Ice',
          icon: '',
          handler: () => {
            this.setPokemonByType(15);
          }
        },
        {
          text: 'Dragon',
          icon: '',
          handler: () => {
            this.setPokemonByType(16);
          }
        },
        {
          text: 'Fairy',
          icon: '',
          handler: () => {
            this.setPokemonByType(17);
          }
        },
        {
          text: 'Shadow',
          icon: '',
          handler: () => {
            this.setPokemonByType(18);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
}
