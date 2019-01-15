
// Angular
import { Component, ViewChild } from '@angular/core';

// RxJS
import { ReplaySubject } from "rxjs/ReplaySubject";
import { ArrayObservable } from "rxjs/observable/ArrayObservable";

// Ionic
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Side Menu Component
import { SideMenuSettings } from './../shared/side-menu-content/models/side-menu-settings';
import { SideMenuOption } from './../shared/side-menu-content/models/side-menu-option';
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content.component';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) navCtrl: Nav;

	// Get the instance to call the public methods
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

	public rootPage: any = 'TabsPage';

	// Options to show in the SideMenuContentComponent
	public options: Array<SideMenuOption>;

	// Settings for the SideMenuContentComponent
	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: true,
		selectedOptionClass: 'active-side-menu-option'
	};

	private unreadCountObservable: any = new ReplaySubject<number>(0);

	constructor(private platform: Platform,
				private statusBar: StatusBar,
				private splashScreen: SplashScreen,
				private alertCtrl: AlertController,
				private menuCtrl: MenuController) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleLightContent();
			this.splashScreen.hide();

			// Initialize some options
			this.initializeOptions();
		});

		// Change the value for the batch every 5 seconds
		setInterval(() => {
			this.unreadCountObservable.next(Math.floor(Math.random() * 10) + 1);
		}, 5000);

	}

	private initializeOptions(): void {
		this.options = new Array<SideMenuOption>();

		// Load simple menu options
		// ------------------------------------------
		this.options.push({
			iconName: 'home',
			displayText: 'Inicio',
			component: 'TabsPage',
		});


		// Load options with nested items (with icons)
		// -----------------------------------------------
		this.options.push({
      displayText: 'Aerogeneradores',
      suboptions: [],
    });

		for (let i = 1; i < 52; i++) {
          this.options[1].suboptions.push({
            displayText: 'Aerogenerador ' + i,
            custom: {titulo:'Aerogenerador nº ' + i,indice: i},
			      component: 'WtgPage',
            iconName: 'ios-stats-outline' //icon original 'list'
          });
        }

	}

	public onOptionSelected(option: SideMenuOption): void {
		this.menuCtrl.close().then(() => {
			if (option.custom && option.custom.isLogin) {
				this.presentAlert('You\'ve clicked the login option!');
			} else if (option.custom && option.custom.isLogout) {
				this.presentAlert('You\'ve clicked the logout option!');
			} else if (option.custom && option.custom.isExternalLink) {
				let url = option.custom.externalUrl;
				window.open(url, '_blank');
			} else {
				// Get the params if any
				const params = option.custom;
				// Redirect to the selected page
				this.navCtrl.setRoot(option.component, params);
			}
		});
	}

	public collapseMenuOptions(): void {
		this.sideMenu.collapseAllOptions();
	}

	public presentAlert(message: string): void {
		let alert = this.alertCtrl.create({
			title: 'Information',
			message: message,
			buttons: ['Ok']
		});
		alert.present();
	}

}
