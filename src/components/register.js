import * as language from "../utils/language"
import * as utils from "../utils/utils"
import { Plugins, Capacitor } from "@capacitor/core"
import { modalController } from "@ionic/core"
import * as Ionicons from 'ionicons/icons';

export async function showRegister(){
    let appLang = this.state.lang
    let modalId = "register-modal-" + utils.generateRandomClassName()

    customElements.define(modalId, class ModalContent extends HTMLElement {
        connectedCallback(){
            this.innerHTML = `
                <ion-header class="ion-header-no-shadow">
                    <ion-toolbar>
                        <ion-buttons>
                            <ion-button onClick="window.customFunctions.dismissModal()">
                                <ion-icon slot="icon-only" icon="` + Ionicons.arrowBack + `"></ion-icon>
                            </ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content fullscreen>
                    <div style="position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); width: 100%;">
                        <center>
                            <h1>Filen</h1>
                            <ion-item style="width: 90%; margin-top: 30px;">
                                <ion-input type="text" id="register-email" placeholder="Email"></ion-input>
                            </ion-item>
                            <ion-item style="width: 90%;">
                                <ion-input type="password" id="register-password" placeholder="Password"></ion-input>
                            </ion-item>
                            <ion-item style="width: 90%;">
                                <ion-input type="number" id="register-2fa" placeholder="2FA code (leave empty if disabled)"></ion-input>
                            </ion-item>
                            <ion-button expand="block" style="width: 90%; margin-top: 50px;">Block Button</ion-button>
                            <br>
                            OR
                            <br>
                            <br>
                            <a onClick="window.customFunctions.openRegisterModal()">Create an account</a>
                        </center>
                    </div>
                </ion-content>
            `;
        }
    })

    let modal = await modalController.create({
        component: modalId,
        swipeToClose: false,
        showBackdrop: false,
        backdropDismiss: false,
        cssClass: "modal-fullscreen"
    })

    modal.present()
}