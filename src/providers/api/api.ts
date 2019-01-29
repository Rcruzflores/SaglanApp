import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiUrl = 'http://192.168.2.10:8001/app_movil/';

//let token: string;
@Injectable()
export class ApiProvider {

  public usuario: any[] = [];
  public grafico: any[] = [];
  public aerogenerador: any[] = [];

  constructor(public http: HttpClient) {}
  login(array) {
      let post_ = new FormData();
      post_.append('username',array[0]);
      post_.append('password',array[1]);
      return this.http.post(apiUrl+'api-token-auth',post_);
  }
  postPortafolioEnergia(){
    let post_ = new FormData();
    post_.append('id','portafolio_energia');
    let header = this.getHttpHeader();
    return this.http.post(apiUrl+'json/',post_,header);
  }
  postPortafolio_InfoWtg(){
    let post_ = new FormData();
    post_.append('id','portafolio_aero');
    let header = this.getHttpHeader();
    return this.http.post(apiUrl+'json/',post_,header);
  }
  postParqueEnergia(id:number){
    let post_ = new FormData();
    post_.append('id','parque_energia');
    post_.append('id_parque',id.toString());
    let header = this.getHttpHeader();
    return this.http.post(apiUrl+'json/',post_,header);
  }
  postParque_InfoWtg(id:number){
    let post_ = new FormData();
    post_.append('id','parque_aero');
    post_.append('id_parque',id.toString());
    let header = this.getHttpHeader();
    return this.http.post(apiUrl+'json/',post_,header);
  }
  postGrWtg(id_w:number) {
      let post_ = new FormData();
      post_.append('id','aerogenerador');
      post_.append('id_wtg',id_w.toString());
      let header = this.getHttpHeader();
      return this.http.post(apiUrl+'json/',post_,header);

  }
  getHttpHeader(){
    //console.log('Token ' + this.token);
    let httpOptions = {
    'headers': new HttpHeaders({
        'Authorization' : 'Token '+ this.usuario['token']
    })
    };
   return httpOptions
 }
}
