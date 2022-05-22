/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  pokemon: any = null;
  subscriptions: Subscription[] = [];

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router
    ) { }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {

      if (this.pokemonService.pokemons.length) {
        this.pokemon = this.pokemonService.pokemons.find(i => i.name === params.name);
        if (this.pokemon) {
          this.getEvolution();
          return;
        }
      }

      this.subscription = this.pokemonService.get(params.name).subscribe(response => {
        this.pokemon = response;
        this.getEvolution();
      }, error => {
        this.createAlert();
      });
    });
  }

  async createAlert() {
    const alert = await this.alertController.create({
      cssClass: 'pokemon-background',
      header: 'Oops!',
      subHeader: 'Pokemon Not Found',
      message: "Make sure to type the correct name.",
      buttons: ['Go Back']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss().finally(() => {
      this.router.navigate(['/home']);
    });
    console.log('onDidDismiss resolved with role', role);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  getEvolution() {
    if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
      this.pokemon.evolutions = [];
      this.subscription = this.pokemonService.getSpecies(this.pokemon.name).subscribe(response => {
        const id = this.getId(response.evolution_chain.url);
        this.subscription = this.pokemonService.getEvolution(id).subscribe(response => this.getEvolves(response.chain));
      });
    }
  }

  getEvolves(chain: any) {
    this.pokemon.evolutions.push({
      id: this.getId(chain.species.url),
      name: chain.species.name
    });

    if (chain.evolves_to.length) {
      this.getEvolves(chain.evolves_to[0]);
    }
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

  getId(url: string): number {
    const splitUrl = url.split('/');
    return +splitUrl[splitUrl.length - 2];
  }

  setTypeIcon(type: string) {
    return this.pokemonService.setTypeIcon(type);
  }

  getClass(pokemon, stat) {
    if(stat > 100) {
      return 'bg-' + this.getType(pokemon);
    }
    return '';
  }

}
